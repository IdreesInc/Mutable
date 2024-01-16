// @ts-check

const PROCESSED_INDICATOR = "mutable-parsed";

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

class TwitterPost extends Post {
	getPostText() {
		return this.postElement.innerText;
	}

	getPostContents() {
		const text = this.postText();
		return text === null ? null : text.replace(this.authorName() ?? "", "").replace(this.authorHandle() ?? "", "");
	}

	getAuthorName() {
		try {
			const usernameElement = $(this.postElement).find('[data-testid="User-Name"]');
			return usernameElement.first().text().split("@")[0].trim();
		} catch (ex) {
			console.error(ex);
			console.error("Could not find author name");
		}
		return null;
	}

	getAuthorHandle() {
		try {
			const usernameElement = $(this.postElement).find('[data-testid="User-Name"]');
			const authorHandleElement = usernameElement.find("span").filter(function () {
				return $(this).text().trim().startsWith("@");
			}).first();
			return authorHandleElement.text();
		} catch (ex) {
			console.error(ex);
			console.error("Could not find author handle");
		}
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
			console.error("Could not find author handle");
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

class MastodonPost extends Post {
	getPostText() {
		return this.postElement.innerText;
	}

	getPostContents() {
		const text = this.postText();
		return text === null ? null : text.replace(this.authorName() ?? "", "").replace(this.authorHandle() ?? "", "");
	}

	getAuthorName() {
		try {
			return $(this.postElement).find(".display-name__html").first().text();
		} catch (ex) {
			console.error(ex);
			console.error("Could not find author name");
		}
		return null;
	}

	getAuthorHandle() {
		try {
			return $(this.postElement).find(".display-name__account").first().text();
		} catch (ex) {
			console.error(ex);
			console.error("Could not find author handle");
		}
		return null;
	}
}


class FacebookPost extends Post {
	getPostText() {
		return this.postElement.innerText;
	}

	getPostContents() {
		const text = this.postText();
		return text;
	}
}

class Parser {

	/**
	 * The unique id of the parser.
	 * @abstract
	 * @type {string}
	 */
	static id = "";
	/**
	 * The name of the parser.
	 * @abstract
	 * @type {string}
	 */
	static parserName = "";
	/**
	 * The washed-out color of the parser's branding.
	 * @abstract
	 * @type {string}
	 */
	static brandColor = "#000000";

	/**
	 * Whether this parser is experimental and should be disabled by default.
	 * @abstract
	 * @type {boolean}
	 */
	static experimental = false;

	/**
	 * Whether this parser applies to the current page.
	 * @abstract
	 * @returns {boolean}
	 */
	static appliesToPage() {
		throw "Not implemented";
	}

	/**
	 * Get all posts on the page.
	 * @abstract
	 * @returns {Post[]}
	 */
	static getPosts() {
		throw "Not implemented";
	}

	/**
	 * Get all parsers.
	 * @returns {typeof Parser[]}
	 */
	static parsers() {
		return [TwitterParser, RedditParser, FacebookParser, MastodonParser, BlueskyParser, UniversalParser];
	}

	/**
	 * @param {string} id
	 */
	static getParserById(id) {
		// TODO: Cache this
		for (let parser of Parser.parsers()) {
			if (parser.id === id) {
				return parser;
			}
		}
		return null;
	}

	/**
	 * @param {string} id
	 */
	static isParserExperimental(id) {
		const parser = Parser.getParserById(id);
		return parser && parser.experimental;
	}
}

class TwitterParser extends Parser {

	static id = "twitter";
	static parserName = "Twitter/X";
	static brandColor = "#DAF2FF";

	static appliesToPage() {
		return window.location.host === "twitter.com";
	}

	/**
	 * @returns {Post[]}
	 */
	static getPosts() {
		let postContainers = $(document).find('[data-testid="tweet"]').parent().filter('[' + PROCESSED_INDICATOR + '!="true"]');
		let posts = [];
		postContainers.each((index) => {
			let postElement = postContainers[index];
			let post = new TwitterPost(postElement);
			posts.push(post);
		});
		return posts;
	}
}

class MastodonParser extends Parser {

	static id = "mastodon";
	static parserName = "Mastodon";
	static brandColor = "#efebff";

	static appliesToPage() {
		return $("body").children().first().attr("id") === "mastodon";
	}

	/**
	 * @returns {Post[]}
	 */
	static getPosts() {
		let postContainers = $(".status.status-public").filter('[' + PROCESSED_INDICATOR + '!="true"]');
		let posts = [];
		postContainers.each((index) => {
			let postElement = postContainers[index];
			let post = new MastodonPost(postElement);
			posts.push(post);
		});
		return posts;
	}
}

class BlueskyParser extends Parser {

	static id = "bluesky";
	static parserName = "Bluesky";
	static brandColor = "#DAF8FF";

	static appliesToPage() {
		return window.location.host === "bsky.app";
	}

	/**
	 * @returns {Post[]}
	 */
	static getPosts() {
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

class RedditParser extends Parser {

	static id = "reddit";
	static parserName = "Reddit";
	static brandColor = "#fff0df";

	static appliesToPage() {
		return window.location.host === "reddit.com" || window.location.host === "www.reddit.com" || window.location.host === "old.reddit.com";
	}

	/**
	 * @returns {Post[]}
	 */
	static getPosts() {
		if (window.location.host.includes("old.reddit.com")) {
			let postContainers = $(document).find('[' + PROCESSED_INDICATOR + '!="true"].thing');
			let posts = [];
			postContainers.each((index) => {
				let postElement = postContainers[index];
				let post = new RedditPost(postElement);
				posts.push(post);
			});
			return posts;
		} else {
			let postContainers = $(document).find('[data-testid="post-container"][' + PROCESSED_INDICATOR + '!="true"]');
			let posts = [];
			if (postContainers.length === 0) {
				// Mobile site
				postContainers = $(document).find('article[class^="Post "][' + PROCESSED_INDICATOR + '!="true"]');
				if (postContainers.length === 0) {
					// Mobile site with new layout
					postContainers = $(document).find('shreddit-post[' + PROCESSED_INDICATOR + '!="true"]');
				}
				postContainers.each((index) => {
					let postElement = postContainers[index];
					let post = new RedditMobilePost(postElement);
					posts.push(post);
				});
			} else {
				// Desktop site
				postContainers.each((index) => {
					let postElement = postContainers[index];
					let post = new RedditPost(postElement);
					posts.push(post);
				});
			}
			return posts;
		}
	}
}

class RedditPost extends Post {
	getPostText() {
		return this.postElement.innerText;
	}

	getPostContents() {
		const text = this.postText();
		return text === null ? null : text.replace(this.authorName() ?? "", "").replace(this.authorHandle() ?? "", "");
	}

	getAuthorHandle() {
		try {
			return $(this.postElement).find('[data-testid="post_author_link"]').text();
		} catch (ex) {
			console.error(ex);
			console.error("Could not find author handle");
		}
		return null;
	}
}

class RedditMobilePost extends Post {
	getPostText() {
		return this.postElement.innerText;
	}

	getPostContents() {
		const text = this.postText();
		return text;
	}
}

class FacebookParser extends Parser {

	static id = "facebook";
	static parserName = "Facebook";
	static brandColor = "#d9ecff";

	static appliesToPage() {
		return window.location.host === "www.facebook.com" || window.location.host === "m.facebook.com";
	}

	/**
	 * @returns {Post[]}
	 */
	static getPosts() {
		let postContainers;
		if (window.location.host === "m.facebook.com") {
			postContainers = $(document).find('[data-tracking-duration-id][' + PROCESSED_INDICATOR + '!="true"]');
		} else {
			postContainers = $(document).find('[aria-labelledby][aria-describedby][' + PROCESSED_INDICATOR + '!="true"]');
		}
		let posts = [];
		postContainers.each((index) => {
			let postElement = postContainers[index];
			let post = new FacebookPost(postElement);
			posts.push(post);
		});
		return posts;
	}
}

class UniversalParser extends Parser {

	static id = "universal-experimental";
	static parserName = "Any Website";
	static brandColor = "#e9ffe0";
	static experimental = true;

	static appliesToPage() {
		// Ensure no other parser applies to this page
		for (let parser of Parser.parsers()) {
			if (parser.id != this.id && parser.appliesToPage()) {
				return false;
			}
		}
		return true;
	}

	/**
	 * @returns {Post[]}
	 */
	static getPosts() {
		// Using jQuery, get every leaf
		// let postContainers = $(document).find("*" + '[' + PROCESSED_INDICATOR + '!="true"]').filter(function () {
		// 	return $(this).children().length === 0;
		// });
		// Using jQuery, get every element with a text node
		// let postContainers = $(document).find("*" + '[' + PROCESSED_INDICATOR + '!="true"]').filter(function () {
		// 	return $(this).contents().filter(function () {
		// 		return this.nodeType === 3;
		// 	}).length > 0;
		// });
		// Using jQuery, get every leaf or element that has text aside from the contents of its children
		let postContainers = $(document).find("*" + '[' + PROCESSED_INDICATOR + '!="true"]').filter(function () {
			return $(this).contents().filter(function () {
				return this.nodeType === 3;
			}).text().trim().length > 0;
		});
		// If the element is a not a div, replace it with its parent
		postContainers = postContainers.map(function () {
			// If this is a span or custom element, replace it with its parent
			let element = this;
			while ((element.tagName.toLowerCase() === "span" || element.tagName.includes("-"))  && element.parentElement && element.parentElement.getAttribute(PROCESSED_INDICATOR) !== "true") {
				element = element.parentElement;
			} 
			return element;
		});
		let posts = [];
		postContainers.each((index) => {
			let postElement = postContainers[index];
			let post = new EverythingPost(postElement);
			posts.push(post);
		});
		return posts;
	}
}

class EverythingPost extends Post {
	getPostText() {
		return this.postElement.innerText;
	}

	getPostContents() {
		const text = this.postText();
		return text;
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
			// Case-sensitive match
			let regex = new RegExp(`\\b${this.word}\\b`);
			return regex.test(contents);
		} else {
			// Case-insensitive match
			let regex = new RegExp(`\\b${this.word}\\b`, "i");
			return regex.test(contents);
		}
	}

	plaintext() {
		return this.word;
	}
}

class Settings {
	/**
	 * @param {Object<string, Group>} [groups]
	 * @param {string[]} [disabledParsers]
	 * @param {string[]} [enabledExperimentalParsers]
	 * @param {string} [globalMuteAction]
	 * @param {boolean} [debugMode]
	 */
	constructor(groups, disabledParsers, enabledExperimentalParsers, globalMuteAction="blur", debugMode) {
		this.groups = groups ?? { "default": new Group("default", "Default Group", [])};
		this.disabledParsers = disabledParsers ?? [];
		this.enabledExperimentalParsers = enabledExperimentalParsers ?? [];
		this.globalMuteAction = globalMuteAction;
		this.debugMode = debugMode ?? false;
	}

	/**
	 * Return the list of groups.
	 * @returns {Group[]}
	 */
	getGroupsList() {
		return Object.values(this.groups);
	}

	/**
	 * @param {string} parserId
	 */
	disableParser(parserId) {
		if (Parser.isParserExperimental(parserId)) {
			this.enabledExperimentalParsers = this.enabledExperimentalParsers.filter((id) => id !== parserId);
		} else {
			if (!this.disabledParsers.includes(parserId)) {
				this.disabledParsers.push(parserId);
			}
		}
	}

	/**
	 * @param {string} parserId
	 */
	enableParser(parserId) {
		if (Parser.isParserExperimental(parserId)) {
			if (!this.enabledExperimentalParsers.includes(parserId)) {
				this.enabledExperimentalParsers.push(parserId);
			}
		} else {
			this.disabledParsers = this.disabledParsers.filter((id) => id !== parserId);
		}
	}

	/**
	 * @param {string} parserId
	 */
	isDisabled(parserId) {
		if (Parser.isParserExperimental(parserId)) {
			return !this.enabledExperimentalParsers.includes(parserId);
		} else {
			return this.disabledParsers.includes(parserId);
		}
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
		let disabledParsers = json.disabledParsers;
		if (disabledParsers === undefined || !Array.isArray(disabledParsers)) {
			console.error("Missing or invalid disabledParsers property: " + JSON.stringify(json));
			return null;
		}

		let enabledExperimentalParsers = json.enabledExperimentalParsers;
		if (enabledExperimentalParsers !== undefined && !Array.isArray(enabledExperimentalParsers)) {
			console.error("Invalid enabledExperimentalParsers property: " + JSON.stringify(json));
			enabledExperimentalParsers = undefined;
		}
		let globalMuteAction = json.globalMuteAction;
		if (globalMuteAction === undefined || typeof globalMuteAction !== "string") {
			console.warn("Missing or invalid globalMuteAction property: " + JSON.stringify(json));
			globalMuteAction = undefined;
		}
		let debugMode = json.debugMode;
		if (typeof debugMode !== "boolean") {
			console.warn("Invalid debugMode property: " + JSON.stringify(json));
			debugMode = undefined;
		}
		return new Settings(groups, disabledParsers, enabledExperimentalParsers, globalMuteAction, debugMode);
	}
}

function generateId() {
	// From nanoid: https://github.com/ai/nanoid
	// With length of 9, 1% chance of collision at 19 million IDs
	let t = 9;
	return crypto.getRandomValues(new Uint8Array(t)).reduce(((t,e)=>t+=(e&=63)<36?e.toString(36):e<62?(e-26).toString(36).toUpperCase():e>62?"-":"_"),"");
}

function convertOldSettings() {
}

/**
 * Get the metadata for the serialized settings from the web extension sync storage.
 * @returns {Promise<object>} A promise that resolves to the metadata
 */
function getSettingsMetadata() {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get("metadata", function (result) {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError);
				reject(chrome.runtime.lastError);
			} else {
				resolve(result.metadata);
			}
		});
	});
}

/**
 * Asynchronously get the settings from the web extension sync storage.
 * @param {boolean} deleteLegacy Whether to delete legacy settings after loading
 * @param {(arg0: Settings) => void} onSuccess The function to call when the settings have been loaded successfully
 * @param {(msg: string) => void} [onFail] The function to call when the settings could not be loaded
 */
function getSettings(deleteLegacy, onSuccess, onFail = (msg) => {console.error(msg)}) {
	if (typeof chrome === "undefined") {
		onFail("Chrome API not found");
		return;
	}
	getSettingsMetadata().then((result) => {
		if (result !== undefined) {
			if (result.v !== 1) {
				onFail("Serialized settings version not supported, expected v1 but got " + result.v);
			} else if (result.n === undefined) {
				onFail("Serialized settings missing number of parts");
			} else {
				// Retrieve the serialized settings in parts
				let keysToGet = ["metadata"];
				for (let i = 0; i < result.n; i++) {
					keysToGet.push("p" + i);
				}
				chrome.storage.sync.get(keysToGet, function (result) {
					if (chrome.runtime.lastError) {
						console.error(chrome.runtime.lastError);
						onFail("Error loading serialized settings from sync storage");
					} else {
						console.log("Serialized settings loaded from sync storage");
						// Reconstruct the serialized settings
						deserializeSettings(result, (deserialized) => {
							let restored = Settings.fromJson(deserialized);
							if (restored) {
								console.log("Settings restored successfully");
								onSuccess(restored);
							} else {
								onFail("Settings could not be restored");
							}
						}, onFail);
					}
				});	
			}
		} else {
			// Possible that the settings were not migrated yet
			getLegacySettings((settings) => {
				if (deleteLegacy) {
					deleteSettings("settings");
				}
				onSuccess(settings);
			}, onFail);
		}
	});
}

/**
 * Asynchronously get legacy settings should they exist.
 * @param {(arg0: Settings) => void} onSuccess
 * @param {(msg: string) => void} onFail
 */
function getLegacySettings(onSuccess, onFail) {
	chrome.storage.sync.get("settings", function (result) {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
			onFail("Error loading legacy settings from sync storage")
		} else if (result.settings === undefined) {
			onFail("Legacy settings not found");
		} else {
			let restored = Settings.fromJson(result.settings);
			if (restored) {
				console.log("Legacy settings restored successfully");
				onSuccess(restored);
			} else {
				onFail("Legacy settings could not be restored");
			}
		}
	});
}

/**
 * Compress and serialize the settings in parts to account for the 8KB limit on the web extension sync storage.
 * @param {Settings} settings
 * @param {(arg0: Object<string, any>) => void} cb The function to call with the serialized settings
 */
function serializeSettings(settings, cb) {
	let serialized = JSON.stringify(settings);
	// Compress with gzip using CompressionStream
	const stream = new Blob([serialized], {
		type: "application/json"
	}).stream();
	const compressionStream = stream.pipeThrough(new CompressionStream("gzip"));
	const reader = compressionStream.getReader();
	let compressed = new Uint8Array();
	reader.read().then(function processResult(result) {
		if (result.done) {
			// Convert to base64
			let base64 = btoa(String.fromCharCode(...compressed));
			let parts  = [];
			// Split into parts of 8KB or less (accounting for base64 overhead)
			const PART_SIZE = 8000;
			for (let i = 0; i < base64.length; i += PART_SIZE) {
				parts.push(base64.substring(i, i + PART_SIZE));
			}
			let serialized = {
				"metadata": {
					"v": 1, // Version
					"n": parts.length, // Number of parts
				}
			};
			for (let i = 0; i < parts.length; i++) {
				serialized["p" + i] = parts[i];
			}
			cb(serialized);
			return;
		}
		compressed = new Uint8Array([...compressed, ...result.value]);
		reader.read().then(processResult);
	});
}

/**
 * Decompress and deserialize the settings.
 * @param {Object<string, any>} serialized
 * @param {(arg0: string) => void} cb The function to call with the deserialized settings
 * @param {(msg: string) => void} onFail The function to call when the settings could not be deserialized
 */
function deserializeSettings(serialized, cb, onFail) {
	if (serialized.metadata === undefined) {
		onFail("Serialized settings missing metadata");
		return;
	}
	if (serialized.metadata.v !== 1) {
		onFail("Serialized settings version not supported, expected v1 but got " + serialized.metadata.v);
		return;
	}
	if (serialized.metadata.n === undefined) {
		onFail("Serialized settings missing number of parts");
		return;
	}
	let encoded = "";
	for (let i = 0; i < serialized.metadata.n; i++) {
		if (serialized["p" + i] === undefined) {
			onFail("Serialized settings missing part " + i);
			return;
		}
		encoded += serialized["p" + i];
	}
	let compressed = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
	const stream = new Blob([compressed]).stream();
	const decompressionStream = stream.pipeThrough(new DecompressionStream("gzip"));
	const reader = decompressionStream.getReader();
	let decompressed = [];
	reader.read().then(function processResult(result) {
		if (result.done) {
			// Convert decompressed bytes to string
			let decompressedString = new TextDecoder("utf-8").decode(new Uint8Array(decompressed));
			// Parse JSON
			let parsed = JSON.parse(decompressedString);
			cb(parsed);
			return;
		}
		decompressed = [...decompressed, ...result.value];
		reader.read().then(processResult);
	});
}

/**
 * Save the settings to the web extension sync storage.
 * @param {Settings} settings The settings to upload
 * @param {() => void} [onSuccess] The function to call when the settings have been saved successfully
 * @param {(msg: string) => void} [onFail] The function to call when the settings could not be saved
 */
function putSettings(settings, onSuccess= () => {}, onFail = (msg) => {console.error(msg)}) {
	if (typeof chrome === "undefined") {
		onFail("Chrome API not found");
		return;
	}
	try {
		serializeSettings(settings, (serializedSettings) => {
			chrome.storage.sync.set(serializedSettings, function () {
				if (chrome.runtime.lastError) {
					console.error(chrome.runtime.lastError);
					onFail(("Settings could not be saved due to a browser storage sync error"));
					chrome.storage.sync.getBytesInUse("settings", function (bytesInUse) {
						console.log("Bytes in use: " + bytesInUse);
						console.log(JSON.stringify(settings));
					});
				} else {
					console.log("Settings saved successfully");
					onSuccess();
				}
			});
		});
	} catch (ex) {
		console.error(ex);
		onFail("Failed to serialize settings");
	}
}

/**
 * Delete the settings from the web extension sync storage.
 * @param {string} key The key of the settings to delete
 */
function deleteSettings(key) {
	if (typeof chrome === "undefined") {
		console.error("Chrome API not found");
		return;
	}
	chrome.storage.sync.remove(key, function () {
		if (chrome.runtime.lastError) {
			console.error(chrome.runtime.lastError);
		} else {
			console.log("Settings with key '" + key + "'deleted successfully");
		}
	});
}

/**
 * Subscribe to changes in the settings.
 * @param {(arg0: Settings) => void} callback
 */
function subscribeToSettings(callback) {
	if (typeof chrome === "undefined") {
		console.error("Chrome API not found");
		return;
	}
	chrome.storage.onChanged.addListener((changes, areaName) => {
		if (areaName === "sync" && changes["metadata"]) {
			getSettings(false, callback);
		}
	});
}