// @ts-check
/// <reference path="../shared.js" />

/** @type {HTMLElement} */
// @ts-ignore
const groupsContainer = document.getElementById("groups-container");
/** @type {HTMLElement} */
// @ts-ignore
const customSites = document.getElementById("custom-sites");
/** @type {HTMLElement} */
// @ts-ignore
const customSitesList = document.getElementById("custom-sites-list");
/** @type {HTMLElement} */
// @ts-ignore
const websitesContent = document.getElementById("websites-content");
/** @type {HTMLInputElement} */
// @ts-ignore
const mutableEnabled = document.getElementById("mutable-enabled");
/** @type {HTMLInputElement} */
// @ts-ignore
const toggleThisWebsite = document.getElementById("toggle-this-website");
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
/** @type {HTMLInputElement} */
// @ts-ignore
const enabledByDefault = document.getElementById("enabled-by-default");
/** @type {HTMLElement} */
// @ts-ignore
const importSettings = document.getElementById("import-settings");
/** @type {HTMLElement} */
// @ts-ignore
const exportSettings = document.getElementById("export-settings");
/** @type {HTMLElement} */
// @ts-ignore
const promptModal = document.getElementById("prompt-modal");
/** @type {HTMLElement} */
// @ts-ignore
const promptTitle = document.getElementById("prompt-title");
/** @type {HTMLElement} */
// @ts-ignore
const promptText = document.getElementById("prompt-text");
/** @type {HTMLInputElement} */
// @ts-ignore
const promptInput = document.getElementById("prompt-input");
/** @type {HTMLElement} */
// @ts-ignore
const promptSubmit = document.getElementById("prompt-submit");
/** @type {HTMLElement} */
// @ts-ignore
const promptCancel = document.getElementById("prompt-cancel");

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
	importSettings.addEventListener("click", () => {
		displayPrompt("import settings", "Paste the settings JSON into the input below", "OK", "Cancel", (value) => {
			try {
				let parsed = JSON.parse(value);
				let newSettings = Settings.fromJson(parsed);
				if (newSettings === null) {
					displayAlert("invalid settings", "The imported settings are invalid");
					return;
				}
				displayConfirm("confirm import", "The imported settings include " + newSettings.getPatternCount() + " pattern(s), press OK to confirm", (didConfirm) => {
					if (didConfirm) {
						currentSettings = newSettings;
						updateSettings();
					}
				});
			} catch (e) {
				displayAlert("invalid settings", "The imported settings were formatted incorrectly:\n" + e.message);
			}
		}, () => {}, "Paste JSON settings here");
	});
	exportSettings.addEventListener("click", () => {
		let encodedSettings = stringifySettings(currentSettings);
		displayPrompt("export settings", "Copy the settings JSON below", "OK", "", () => {}, undefined, "Settings JSON", encodedSettings);
	});
	initModals();
}

function updateFoil(scrollRatio, mouseRatio) {
	let ratio = scrollRatio * 0.5 + mouseRatio * 0.5;
	background.style.backgroundPositionX  = `${ratio * 80}%`;
}

function initSettings() {
	// Update the settings when the toggle is changed
	toggleThisWebsite.addEventListener("change", () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			let currentTab = tabs[0];
			if (currentTab.url !== undefined) {
				let url = new URL(currentTab.url);
				let hostname = url.hostname;
				currentSettings.setWebsiteEnabled(hostname, toggleThisWebsite.checked);
				updateSettings();
			}
		});
	});
	globalMuteAction.addEventListener("change", () => {
		currentSettings.globalMuteAction = globalMuteAction.value;
		updateSettings();
	});
	debugMode.addEventListener("change", () => {
		currentSettings.debugMode = debugMode.checked;
		updateSettings();
	});
	enabledByDefault.addEventListener("change", () => {
		currentSettings.enabledByDefault = enabledByDefault.checked;
		updateSettings();
	});
}

function renderSettings() {
	mutableEnabled.checked = currentSettings.mutableEnabled;
	mutableEnabled.addEventListener("change", () => {
		currentSettings.mutableEnabled = mutableEnabled.checked;
		updateSettings();
	});
	// Load toggle's initial state based on the current tab
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		let currentTab = tabs[0];
		if (currentTab.url !== undefined) {
			let url = new URL(currentTab.url);
			let hostname = url.hostname;
			if (currentSettings.enabledByDefault) {
				toggleThisWebsite.checked = currentSettings.isSiteEnabled(hostname);
			} else {
				toggleThisWebsite.checked = currentSettings.isSiteExplicitlyEnabled(hostname);
			}
			toggleThisWebsite.disabled = false;
		} else {
			// Disable the toggle on pages like the browser settings
			toggleThisWebsite.checked = false;
			toggleThisWebsite.disabled = true;
		}
	});
	customSitesList.innerHTML = "";
	const websiteRules = currentSettings.getWebsiteRulesList();
	if (websiteRules.length === 0) {
		customSites.style.display = "none";
	} else {
		customSites.style.display = "block";
	}
	// Sort the website rules by host in alphabetical order
	websiteRules.sort((a, b) => {
		return a.host.localeCompare(b.host);
	});
	const hostLabelMaxLength = 16;
	for (let site of websiteRules) {
		const siteElement = document.createElement("div");
		siteElement.classList.add("group-element");
		// Truncate the host if it's too long
		let hostLabel = site.host;
		if (hostLabel.length > hostLabelMaxLength) {
			hostLabel = hostLabel.substring(0, hostLabelMaxLength) + "...";
		}
		// Hovering over the host will show the full host
		siteElement.title = site.host;
		siteElement.textContent = hostLabel;
		const siteDelete = document.createElement("button");
		siteDelete.classList.add("element-delete");
		siteDelete.classList.add("site-delete");
		siteDelete.innerText = "x";
		if (siteDelete !== null) {
			siteDelete.addEventListener("click", () => {
				currentSettings.deleteSiteRule(site.host);
				updateSettings();
			});
		}
		siteElement.appendChild(siteDelete);
		const siteToggle = document.createElement("label");
		siteToggle.innerHTML = `
			<label class="toggle-switch settings-toggle">
				<input type="checkbox">
				<span class="toggle-inner settings-toggle-inner"></span>
			</label>
		`;
		const siteToggleInput = siteToggle.querySelector("input");
		if (siteToggleInput === null) {
			throw new Error("Could not find input element in site toggle");
		}
		siteToggleInput.checked = site.enabled;
		siteToggleInput.addEventListener("change", () => {
			site.enabled = siteToggleInput.checked;
			updateSettings();
		});
		siteElement.appendChild(siteToggle);
		customSitesList.appendChild(siteElement);
	}

	// Render the muted keywords
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
		groupContent.classList.add("mute-list");
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
			groupContent.prepend(groupElement);
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
		groupContent.prepend(addButton);
		groupElement.appendChild(groupContent);
		groupsContainer.appendChild(groupElement);
	}
	globalMuteAction.value = currentSettings.globalMuteAction;
	debugMode.checked = currentSettings.debugMode;
	enabledByDefault.checked = currentSettings.enabledByDefault;
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
	hideModals();

	addWordInput.value = "";
	addWordCaseSensitive.checked = false;
	addWordSubmitCallback = submitCallback;

	addWordModal.style.display = "";
	modalContainer.style.display = "flex";

	addWordInput.focus();
}

/**
 * @param {string} title
 * @param {string} text
 */
function displayAlert(title, text) {
	displayPrompt(title, text, "OK", "", () => {}, () => {});
}

/**
 * @param {string} title
 * @param {string} text
 * @param {((confirm: boolean) => void)} callback
 */
function displayConfirm(title, text, callback) {
	displayPrompt(title, text, "OK", "Cancel", () => {
		callback(true);
	}, () => {
		callback(false);
	});
}

/**
 * @param {string} title
 * @param {string} text
 * @param {string} [submitText]
 * @param {string} [cancelText]
 * @param {((input: string) => void)} [onSubmit]
 * @param {() => void|null} [onCancel]
 * @param {string} [placeholder]
 */
function displayPrompt(title, text, submitText, cancelText, onSubmit, onCancel, placeholder = "", value = "") {
	hideModals();

	promptTitle.textContent = title;
	promptText.textContent = text;
	if (value != "" || placeholder != "") {
		promptInput.style.display = "";
		promptInput.value = value;
		promptInput.placeholder = placeholder; 
	} else {
		promptInput.style.display = "none";
	}
	if (!onSubmit || !submitText) {
		promptSubmit.style.display = "none";
	} else {
		promptSubmit.textContent = submitText;
		promptSubmit.onclick = () => {
			hideModals();
			onSubmit(promptInput.value);
		};
	}

	let windowControls = promptModal.getElementsByClassName("window-controls")[0];
	if (!onCancel || !cancelText) {
		promptCancel.style.display = "none";
		windowControls.addEventListener("click", () => {
			hideModals();
		});
	} else {
		promptCancel.style.display = "";
		promptCancel.textContent = cancelText;
		promptCancel.onclick = () => {
			hideModals();
			onCancel();
		};
		windowControls.addEventListener("click", () => {
			hideModals();
			onCancel();
		});
	}
	
	promptModal.style.display = "";
	modalContainer.style.display = "flex";
}

function hideModals() {
	addWordModal.style.display = "none";
	promptModal.style.display = "none";
	modalContainer.style.display = "none";
}