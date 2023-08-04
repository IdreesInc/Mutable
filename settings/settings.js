// @ts-check
/// <reference path="../shared.js" />

/** @type {HTMLElement} */
// @ts-ignore
const groupsContainer = document.getElementById("groups-container");
/** @type {HTMLInputElement} */
// @ts-ignore
const blueskyCheckbox = document.getElementById("bluesky-checkbox");

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
	blueskyCheckbox.addEventListener("change", () => {
		currentSettings.blueskyDisabled = !blueskyCheckbox.checked;
		updateSettings();
	});
}

function renderSettings() {
	blueskyCheckbox.checked = !currentSettings.blueskyDisabled;
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