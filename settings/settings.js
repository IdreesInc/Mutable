// @ts-check
/// <reference path="../shared.js" />

/** @type {HTMLElement} */
// @ts-ignore
const groupsContainer = document.getElementById("groups-container");
/** @type {HTMLElement} */
// @ts-ignore
const websitesContent = document.getElementById("websites-content");

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
			let keyword = prompt("Enter a keyword to mute");
			if (!keyword) {
				return;
			}
			group.addPattern(new KeywordMute(uuid(), keyword, false));
			updateSettings();
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