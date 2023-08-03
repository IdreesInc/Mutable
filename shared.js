// @ts-check

/**
 * An abstract class representing a post on a content feed.
 * This class is designed to lazy-load the parsed elements of the post only when requested and cache the values.
 */
class Post {
	/**
	 * The full text contents of the post element.
	 * @type {string|null}
	 */
	#postText = null;
	/**
	 * The text contents of the post without the author's name or handle (if present).
	 * @type {string|null}
	 */
	#postContents = null;
	/**
	 * The name of the author.
	 * @type {string|null}
	 */
	#authorName = null;
	/**
	 * The handle of the author.
	 * @type {string|null}
	 */
	#authorHandle = null;
	/**
	 * The alt text of the media in the post.
	 * @type {string[]|null}
	 */
	#mediaAltText = null;

	/**
	 * @param {HTMLElement} postElement
	 */
	constructor(postElement) {
		this.postElement = postElement;
	}
	
	/**
	 * @returns {string|null}
	 */
	postText() {
		this.#postText = this.#postText ?? this.getPostText();
		return this.#postText;
	}

	/**
	 * @returns {string|null}
	 */
	getPostText() {
		return null;
	}

	/**
	 * @returns {string|null}
	 */
	postContents() {
		this.#postContents = this.#postContents ?? this.getPostContents();
		return this.#postContents;
	}

	/**
	 * @returns {string|null}
	 */
	getPostContents() {
		return null;
	}

	/**
	 * @returns {string|null}
	 */
	authorName() {
		this.#authorName = this.#authorName ?? this.getAuthorName();
		return this.#authorName;
	}

	/**
	 * @returns {string|null}
	 */
	getAuthorName() {
		return null;
	}

	/**
	 * @returns {string|null}
	 */
	authorHandle() {
		this.#authorHandle = this.#authorHandle ?? this.getAuthorHandle();
		return this.#authorHandle;
	}

	/**
	 * @returns {string|null}
	 */
	getAuthorHandle() {
		return null;
	}

	/**
	 * @returns {string[]|null}
	 */
	mediaAltText() {
		this.#mediaAltText = this.#mediaAltText ?? this.getMediaAltText();
		return this.#mediaAltText;
	}

	/**
	 * @returns {string[]|null}
	 */
	getMediaAltText() {
		return null;
	}
}

class BlueskyPost extends Post {
	getPostText() {
		return this.postElement.innerText;
	}

	getPostContents() {
		const text = this.postText();
		return text === null ? null : text.replace(this.authorName() ?? "", "").replace(this.authorHandle() ?? "", "");
	}

	getAuthorName() {
		try {
			const authorNameElement = $(this.postElement).find("span").filter(function () {
				return $(this).text().trim().startsWith("@");
			}).first().parent();
			return authorNameElement.text().replace(this.authorHandle() ?? "", "").trim();
		} catch (ex) {
			console.error(ex);
			console.error("Could not find author name");
		}
		return null;
	}

	getAuthorHandle() {
		try {
			const authorHandleElement = $(this.postElement).find("span").filter(function () {
				return $(this).text().trim().startsWith("@");
			}).first();
			return authorHandleElement.text();
		} catch (ex) {
			console.error(ex);
			console.error("Could not find author name");
		}
		return null;
	}

	getMediaAltText() {
		try {
			let altTexts = [];
			$(this.postElement).find(".expo-image-container").parent().each((index, element) => {
				const altText = element.getAttribute("aria-label");
				if (altText) {
					altTexts.push(altText);
				}
			});
			return altTexts;
		} catch (ex) {
			console.error(ex);
			console.error("Could not find media alt text");
		}
		return null;
	}
}

class Parser {
	/**
	 * Get all posts on the page.
	 * @returns {Post[]}
	 */
	getPosts() {
		throw "Not implemented";
	}
}

class BlueskyParser extends Parser {
	/**
	 * @returns {Post[]}
	 */
	getPosts() {
		let postContainers = $(document).find('[data-testid^="feedItem"][' + PROCESSED_INDICATOR + '!="true"]');
		let posts = [];
		postContainers.each((index) => {
			let postElement = postContainers[index];
			let post = new BlueskyPost(postElement);
			posts.push(post);
		});
		return posts;
	}
}

class Group {
	/**
	 * @param {string} id
	 * @param {string} name
	 * @param {MutePattern[]} patterns
	 */
	constructor(id, name, patterns) {
		this.id = id;
		this.name = name;
		this.patterns = patterns;
	}

	/**
	 * @param {MutePattern} pattern
	 */
	addPattern(pattern) {
		this.patterns.push(pattern);
	}

	/**
	 * @param {string} patternId
	 */
	deletePattern(patternId) {
		this.patterns = this.patterns.filter((pattern) => pattern.id !== patternId);
	}

	/**
	 * Deserialize a group from JSON.
	 * @param {object} json
	 * @returns {Group|null} The deserialized group, or null if the group could not be deserialized
	 */
	static fromJson(json) {
		if (json.id === undefined || typeof json.id !== "string") {
			console.error("Missing id property: " + JSON.stringify(json));
			return null;
		}
		if (json.name === undefined || typeof json.name !== "string") {
			console.error("Missing name property: " + JSON.stringify(json));
			return null;
		}
		if (json.patterns === undefined) {
			console.error("Missing patterns property: " + JSON.stringify(json));
			return null;
		}
		let patterns = [];
		for (let pattern of json.patterns) {
			let deserializedPattern = MutePattern.fromJson(pattern);
			if (deserializedPattern) {
				patterns.push(deserializedPattern);
			}
		}
		return new Group(json.id, json.name, patterns);
	}
}

class MutePattern {
	/**
	 * @param {string} id
	 * @param {string} patternType
	 */
	constructor(id, patternType) {
		this.id = id;
		this.patternType = patternType;
	}
	/**
	 * Determine whether the provided text matches this pattern.
	 * @abstract
	 * @param {string} contents The contents to test the match against
	 * @returns {boolean} Whether the text matches this pattern
	 */
	isMatch(contents) {
		return false;
	}

	/**
	 * Get the plaintext representation of this pattern.
	 * @abstract
	 * @returns {string} The plaintext representation of this pattern
	 */
	plaintext() {
		return "";
	}

	/**
	 * Deserialize a pattern from JSON.
	 * @param {object} json
	 * @returns {MutePattern|null} The deserialized pattern, or null if the pattern could not be deserialized
	 */
	static fromJson(json) {
		if (json.id === undefined || typeof json.id !== "string") {
			console.error("Missing id property: " + JSON.stringify(json));
			return null;
		}
		if (json.patternType === "keyword") {
			if (json.word === undefined) {
				console.error("Missing word property: " + JSON.stringify(json));
				return null;
			}
			if (json.caseSensitive === undefined) {
				console.error("Missing caseSensitive property: " + JSON.stringify(json));
				return null;
			}
			return new KeywordMute(json.id, json.word, json.caseSensitive);
		} else {
			console.error(`Unknown pattern type: ${json.patternType}`);
			return null;
		}
	}
}

class KeywordMute extends MutePattern {
	/**
	 * @param {string} id
	 * @param {string} word
	 */
	constructor(id, word, caseSensitive = false) {
		super(id, "keyword");
		this.word = word;
		this.caseSensitive = caseSensitive;
	}

	/**
	 * @param {string} contents
	 */
	isMatch(contents) {
		if (this.caseSensitive) {
			return contents.includes(this.word);
		} else {
			return contents.toLowerCase().includes(this.word.toLowerCase());
		}
	}

	plaintext() {
		return this.word;
	}
}

class Settings {
	/**
	 * @param {Object<string, Group>} [groups]
	 */
	constructor(groups) {
		this.groups = groups ?? { "default": new Group("default", "Default Group", [])};
	}

	/**
	 * Return the list of groups.
	 * @returns {Group[]}
	 */
	getGroupsList() {
		return Object.values(this.groups);
	}

	/**
	 * Deserialize settings from JSON.
	 * @param {object} json
	 * @returns {Settings|null} The deserialized settings, or null if the settings could not be deserialized
	 */
	static fromJson(json) {
		if (json.groups === undefined) {
			console.error("Missing groups property: " + JSON.stringify(json));
			return null;
		}
		/** @type {Object<string, Group>} */
		let groups = {};
		for (let [groupId, group] of Object.entries(json.groups)) {
			if (typeof groupId !== "string") {
				console.error("Group id is not a string: " + JSON.stringify(groupId));
				continue;
			}
			let deserializedGroup = Group.fromJson(group);
			if (deserializedGroup) {
				groups[groupId] = deserializedGroup;
			}
		}
		if (Object.keys(groups).length === 0) {
			console.error("No groups were deserialized");
			return null;
		} else if (!groups["default"]) {
			console.error("Default group was not found");
			return null;
		}
		return new Settings(groups);
	}
}

function uuid() {
	return crypto.randomUUID();
}

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
 * @param {(arg0: Settings) => void} onSuccess The function to call when the settings have been loaded successfully
 * @param {() => void} [onError] The function to call when the settings could not be loaded
 */
function getSettings(onSuccess, onError) {
	if (typeof chrome === "undefined") {
		console.error("Chrome API not found");
		if (onError) {
			onError();
		}
		return;
	}
	getSerializedSettings().then((result) => {
		if (result) {
			console.log("Serialized settings loaded from sync storage");
			let restored = Settings.fromJson(result);
			if (restored) {
				console.log("Settings restored successfully");
				onSuccess(restored);
			} else {
				console.error("Settings could not be restored");
				if (onError) {
					onError();
				}
			}
		} else {
			console.error("Serialized settings not found");
			if (onError) {
				onError();
			}
		}
	});
}

/**
 * Save the settings to the web extension sync storage.
 * @param {Settings} settings The settings to upload
 * @param {() => void} [onSuccess] The function to call when the settings have been saved successfully
 * @param {() => void} [onError] The function to call when the settings could not be saved
 */
function putSettings(settings, onSuccess, onError) {
	if (typeof chrome === "undefined") {
		console.error("Chrome API not found");
		if (onError) {
			onError();
		}
		return;
	}
	chrome.storage.sync.set({ "settings": settings }, function () {
		if (chrome.runtime.lastError) {
			console.error("Settings could not be saved");
			console.error(chrome.runtime.lastError);
			if (onError) {
				onError();
			}
		} else {
			console.log("Settings saved successfully");
			if (onSuccess) {
				onSuccess();
			}
		}
	});
}