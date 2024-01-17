// @ts-check
/// <reference path="../shared.js" />

/** @type {HTMLElement} */
// @ts-ignore
const groupsContainer = document.getElementById("groups-container");
/** @type {HTMLElement} */
// @ts-ignore
const websitesContent = document.getElementById("websites-content");
/** @type {HTMLElement} */
// @ts-ignore
const normalParsers = document.getElementById("normal-parsers");
/** @type {HTMLElement} */
// @ts-ignore
const experimentalParsers = document.getElementById("experimental-parsers");
/** @type {HTMLElement} */
// @ts-ignore
const background = document.getElementById("background");
/** @type {HTMLElement} */
// @ts-ignore
const modalContainer = document.getElementById("modal-container");
/** @type {HTMLElement} */
// @ts-ignore
const addWordModal = document.getElementById("add-word-modal");
/** @type {HTMLInputElement} */
// @ts-ignore
const addWordInput = document.getElementById("add-word-input");
/** @type {HTMLInputElement} */
// @ts-ignore
const addWordCaseSensitive = document.getElementById("add-word-case-sensitive");
/** @type {HTMLElement} */
// @ts-ignore
const addWordSubmit = document.getElementById("add-word-submit");
/** @type {((keyword: string, caseSensitive: boolean) => void)} */
let addWordSubmitCallback = () => {};
/** @type {HTMLElement} */
// @ts-ignore
const addWordCancel = document.getElementById("add-word-cancel");
/** @type {HTMLSelectElement} */
// @ts-ignore
const globalMuteAction = document.getElementById("global-mute-action");
/** @type {HTMLElement} */
// @ts-ignore
const acknowledgementsWindow = document.getElementById("acknowledgements-window");
/** @type {HTMLElement} */
// @ts-ignore
const acknowledgements = document.getElementById("acknowledgements");
/** @type {HTMLInputElement} */
// @ts-ignore
const debugMode = document.getElementById("debug-mode");

let currentSettings = new Settings();
let deletedLegacySettings = false;

init();

function init() {
	getSettings((result) => {
		currentSettings = result;
		initSettings();
		renderSettings();
	}, (msg) => {
		console.error(msg);
		console.log("No settings found, creating default settings");
		initSettings();
		renderSettings();
	});
	let scrollRatio = 0;
	let mouseRatio = 0;
	// Move background x position as a product of the scroll y position
	document.addEventListener("scroll", () => {
		// calculate scroll ratio (0 at top, 1 at bottom)
		scrollRatio = window.scrollY / (document.body.scrollHeight - window.innerHeight);
		updateFoil(scrollRatio, mouseRatio);
	});
	// Move background x position as a product of the mouse y position
	document.addEventListener("mousemove", (event) => {
		mouseRatio = event.clientY / window.innerHeight;
		updateFoil(scrollRatio, mouseRatio);
	});
	acknowledgements.addEventListener("click", () => {
		acknowledgementsWindow.style.display = "block";
	});
	initModals();
}

function updateFoil(scrollRatio, mouseRatio) {
	let ratio = scrollRatio * 0.5 + mouseRatio * 0.5;
	background.style.backgroundPositionX  = `${ratio * 80}%`;
}

function initSettings() {
	for (let parser of Parser.parsers()) {
		let id = parser.id;
		let name = parser.parserName;
		let website = document.createElement("div");
		website.classList.add("website");
		let websiteName = document.createElement("div");
		websiteName.classList.add("website-name");
		websiteName.textContent = name;
		website.appendChild(websiteName);
		let toggleSwitch = document.createElement("label");
		toggleSwitch.classList.add("toggle-switch");
		let toggleCheckbox = document.createElement("input");
		toggleCheckbox.id = `${id}-checkbox`;
		toggleCheckbox.type = "checkbox";
		toggleCheckbox.checked = true;
		toggleSwitch.appendChild(toggleCheckbox);
		let toggleInner = document.createElement("span");
		toggleInner.classList.add("toggle-inner");
		toggleSwitch.appendChild(toggleInner);
		website.appendChild(toggleSwitch);
		website.style.background = `linear-gradient(90deg, ${parser.brandColor} 0%, white 80%)`;
		if (parser.experimental) {
			experimentalParsers.appendChild(website);
		} else {
			normalParsers.appendChild(website);
		}
		/** @type {HTMLInputElement} */
		// @ts-ignore
		let checkbox = document.getElementById(`${id}-checkbox`);
		checkbox.addEventListener("change", () => {
			console.log("Change for " + id + " to " + checkbox.checked);
			if (checkbox.checked) {
				currentSettings.enableParser(id);
			} else {
				currentSettings.disableParser(id);
			}
			updateSettings();
		});
	}
	globalMuteAction.addEventListener("change", () => {
		currentSettings.globalMuteAction = globalMuteAction.value;
		updateSettings();
	});
	debugMode.addEventListener("change", () => {
		currentSettings.debugMode = debugMode.checked;
		updateSettings();
	});
}

/**
 * @param {string} parserId
 * @param {boolean} value
 */
function updateCheckbox(parserId, value) {
	/** @type {HTMLInputElement|undefined} */
	// @ts-ignore
	let checkbox = document.getElementById(`${parserId}-checkbox`);
	if (checkbox) {
		checkbox.checked = value;
	}
}

function renderSettings() {
	for (let parser of Parser.parsers()) {
		updateCheckbox(parser.id, !currentSettings.isDisabled(parser.id));
	}
	groupsContainer.innerHTML = "";
	for (let group of currentSettings.getGroupsList()) {
		let groupElement = document.createElement("div");
		groupElement.classList.add("group");
		let groupTopBar = document.createElement("div");
		groupTopBar.classList.add("group-top-bar");
		let groupTitle = document.createElement("div");
		groupTitle.classList.add("group-name");
		groupTitle.textContent = group.name;
		groupTopBar.appendChild(groupTitle);
		groupElement.appendChild(groupTopBar);
		let groupContent = document.createElement("div");
		groupContent.classList.add("group-content");
		for (let pattern of group.patterns) {
			let groupElement = document.createElement("div");
			groupElement.classList.add("group-element");
			groupElement.textContent = pattern.plaintext();
			let deleteButton = document.createElement("button");
			deleteButton.classList.add("element-delete");
			deleteButton.textContent = "x";
			deleteButton.addEventListener("click", () => {
				group.deletePattern(pattern.id);
				updateSettings();
			});
			groupElement.appendChild(deleteButton);
			groupContent.appendChild(groupElement);
		}
		let addButton = document.createElement("div");
		addButton.classList.add("add-button");
		addButton.innerHTML = `
			<div class="add-button-text">add word</div>
			<div class="add-button-plus">+</div>
		`;
		if (group.patterns.length === 0) {
			addButton.classList.add("add-button-empty");
		}
		addButton.addEventListener("click", () => {
			displayAddWordModal((keyword, caseSensitive) => {
				if (keyword.trim().length === 0) {
					return;
				}
				group.addPattern(new KeywordMute(generateId(), keyword, caseSensitive));
				updateSettings();
			});
		});
		groupContent.appendChild(addButton);
		groupElement.appendChild(groupContent);
		groupsContainer.appendChild(groupElement);
	}
	globalMuteAction.value = currentSettings.globalMuteAction;
	debugMode.checked = currentSettings.debugMode;
}

function updateSettings() {
	putSettings(currentSettings, () => {
		if (!deletedLegacySettings) {
			deletedLegacySettings = true;
			// Remove legacy settings now that we have successfully saved the new settings
			// TODO: Remove this in a few versions
			deleteSettings("settings");
		}
		renderSettings();
	});
}


function initModals() {
	addWordCancel.addEventListener("click", () => {
		hideModals();
	});
	addWordSubmit.addEventListener("click", () => {
		let keyword = addWordInput.value;
		if (!keyword) {
			alert("Please enter a keyword");
			return;
		}
		hideModals();
		addWordSubmitCallback(keyword, addWordCaseSensitive.checked);
	});
	// Get the nested child of class window-controls from addWordModal
	let windowControls = addWordModal.getElementsByClassName("window-controls")[0];
	windowControls.addEventListener("click", () => {
		hideModals();
	});
}

/**
 * @param {((keyword: string, caseSensitive: boolean) => void)} submitCallback
 */
function displayAddWordModal(submitCallback) {
	addWordInput.value = "";
	addWordCaseSensitive.checked = false;
	addWordSubmitCallback = submitCallback;

	addWordModal.style.display = "";
	modalContainer.style.display = "flex";

	addWordInput.focus();
}

function hideModals() {
	addWordModal.style.display = "none";
	modalContainer.style.display = "none";
}