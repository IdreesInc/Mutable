// @ts-check
/// <reference path="types.js" />

const PROCESSED_INDICATOR = "mutable-parsed";
/** @type {Settings} */
let settings = new Settings();

init();

/**
 * Get the serialized settings from the web extension sync storage.
 * @returns {Promise<object>} A promise that resolves to the serialized settings
 */
function getSerializedSettings() {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get("settings", function (result) {
			if (chrome.runtime.lastError) {
				error(chrome.runtime.lastError);
				reject(chrome.runtime.lastError);
			} else {
				resolve(result.settings);
			}
		});
	});
}

/**
 * Asynchronously get the settings from the web extension sync storage and update the settings variable.
 */
function getSettings() {
	getSerializedSettings().then((result) => {
		if (result) {
			log("Serialized settings loaded from sync storage");
			let restored = Settings.fromJson(result);
			if (restored) {
				log("Settings restored successfully");
				settings = restored;
			} else {
				error("Settings could not be restored");
			}
		} else {
			log("Serialized settings not found");
		}
	});
}

/**
 * Save the settings to the web extension sync storage.
 * @param {Settings} settings The settings to upload
 */
function putSettings(settings) {
	chrome.storage.sync.set({ "settings": settings }, function () {
		if (chrome.runtime.lastError) {
			error(chrome.runtime.lastError);
		}
	});
}



function init() {
	log("Mutable has been loaded successfully!");
	getSettings();
}

/**
 * Parse the page for posts and hide any that match the mute patterns.
 */
function parse() {
	if (window.location.host === "bsky.app") {
		let posts = new BlueskyParser().getPosts();
		log(`Found ${posts.length} posts`)
		for (let post of posts) {
			post.postElement.setAttribute(PROCESSED_INDICATOR, "true");
			log(post.authorName());
			if (match(post)) {
				hidePost(post.postElement);
			}
		}
	}
}

/**
 * Determine whether the provided post matches any of the mute patterns.
 * @param {Post} post The post to check
 */
function match(post) {
	const contents = post.postContents();
	const groups = settings.getGroupsList();
	if (contents) {
		for (let group of groups) {
			for (let pattern of group.patterns) {
				if (pattern.isMatch(contents)) {
					return true;
				}
			}
		}
	}
	const altTexts = post.mediaAltText();
	if (altTexts) {
		for (let altText of altTexts) {
			for (let group of groups) {
				for (let pattern of group.patterns) {
					if (pattern.isMatch(altText)) {
						return true;
					}
				}
			}
		}
	}
}

/**
 * @param {HTMLElement} element
 */
function hidePost(element) {
	element.style.filter = "blur(10px)";
	element.addEventListener("click", function (event) {
		if (element.style.filter === "blur(10px)") {
			element.style.filter = "blur(0px)";
			event.stopPropagation();
		}
	});
}

/**
 * @param {any} message
 */
function log(message) {
	console.log(`Mutable: ${message}`);
}

/**
 * @param {any} message
 */
function error(message) {
	console.error(`Mutable: ${message}`);
}