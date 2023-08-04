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

let currentSettings = new Settings();

init();

function init() {
	getSettings((result) => {
		currentSettings = result;
		initSettings();
		renderSettings();
	}, () => {
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
	initModals();
}

function updateFoil(scrollRatio, mouseRatio) {
	let ratio = scrollRatio * 0.5 + mouseRatio * 0.5;
	background.style.backgroundPositionX  = `${ratio * 80}%`;
	// TODO: Accredit kjpargeter
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
}

function hideModals() {
	addWordModal.style.display = "none";
	modalContainer.style.display = "none";
}

function initSettings() {
	for (let parser of Parser.parsers()) {
		let id = parser.id;
		let name = parser.parserName;
		let website = document.createElement("div");
		website.classList.add("website");
		// set element id
		website.innerHTML = `
			<div class="website-name">${name}</div>
			<label class="toggle-switch">
				<input id="${id}-checkbox" type="checkbox" checked>
				<span class="toggle-inner"></span>
			</label>
		`;
		website.style.background = `linear-gradient(90deg, ${parser.brandColor} 0%, white 80%)`;
		websitesContent.appendChild(website);
		/** @type {HTMLInputElement} */
		// @ts-ignore
		let checkbox = document.getElementById(`${id}-checkbox`);
		checkbox.addEventListener("change", () => {
			if (checkbox.checked) {
				currentSettings.enableParser(id);
			} else {
				currentSettings.disableParser(id);
			}
			updateSettings();
		});
	}
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
		groupElement.innerHTML = `
			<div class="group-top-bar">
				<div class="group-name">${group.name}</div>
			</div>
		`;
		let groupContent = document.createElement("div");
		groupContent.classList.add("group-content");
		for (let pattern of group.patterns) {
			let groupElement = document.createElement("div");
			groupElement.classList.add("group-element");
			groupElement.innerHTML = `
				${pattern.plaintext()}
			`;
			let deleteButton = document.createElement("button");
			deleteButton.classList.add("element-delete");
			deleteButton.innerHTML = "x";
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
		addButton.addEventListener("click", () => {
			displayAddWordModal((keyword, caseSensitive) => {
				if (keyword.trim().length === 0) {
					return;
				}
				group.addPattern(new KeywordMute(uuid(), keyword, caseSensitive));
				updateSettings();
			});
		});
		groupContent.appendChild(addButton);
		groupElement.appendChild(groupContent);
		groupsContainer.appendChild(groupElement);
	}
}

function updateSettings() {
	putSettings(currentSettings, () => {
		renderSettings();
	});
}