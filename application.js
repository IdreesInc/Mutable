// @ts-check
/// <reference path="shared.js" />

/** @type {Settings} */
let settings = new Settings();

init();

function init() {
	log("Mutable has been loaded successfully!");
	getSettings((result) => {
		settings = result;
		initParsing();
	}, () => {
		initParsing();
	});
	subscribeToSettings((result) => {
		log("Settings updated");
		resetPosts();
		settings = result;
	});
}

function initParsing() {
	// Every second, parse the page for new posts
	setInterval(() => {
		parse();
	}, 1000);
	// Also parse whenever the page is scrolled (but only once per second)
	let scrollTimeout = null;
	document.addEventListener("wheel", () => {
		if (scrollTimeout) {
			clearTimeout(scrollTimeout);
		} else {
			parse();
		}
		scrollTimeout = setTimeout(() => {
			parse();
		}, 100);
	});
	parse();
}

/**
 * Parse the page for posts and hide any that match the mute patterns.
 */
function parse() {
	let posts;
	for (let parser of Parser.parsers()) {
		if (parser.appliesToPage() && !settings.isDisabled(parser.id)) {
			posts = parser.getPosts();
		}
	}
	if (!posts) {
		return;
	}
	log(`Found ${posts.length} posts`)
	for (let post of posts) {
		post.postElement.setAttribute(PROCESSED_INDICATOR, "true");
		// console.log(post.authorHandle());
		// console.log(post.authorName());
		// console.log(post.postContents());
		let matchText = match(post);
		if (matchText !== null) {
			hidePost(post.postElement, matchText);
		}
	}
}

/**
 * Determine whether the provided post matches any of the mute patterns.
 * @param {Post} post The post to check
 * @returns {string|null} The pattern that matched, or null if no pattern matched
 */
function match(post) {
	const contents = post.postContents();
	const groups = settings.getGroupsList();
	if (contents) {
		for (let group of groups) {
			for (let pattern of group.patterns) {
				if (pattern.isMatch(contents)) {
					return pattern.plaintext();
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
						return pattern.plaintext();
					}
				}
			}
		}
	}
	return null;
}

/**
 * @param {HTMLElement} element
 * @param {string} reason
 */
function hidePost(element, reason) {
	if (settings.globalMuteAction === "blur") {
		element.classList.add("mutable-blur");
		element.addEventListener("click", function (event) {
			if (element.classList.contains("mutable-blur")) {
				element.classList.remove("mutable-blur");
				event.stopPropagation();
			}
		});
	} else if (settings.globalMuteAction === "blur-preview") {
		element.classList.add("mutable-blur-explanation");
		element.setAttribute("data-mutable-match", reason);
		element.addEventListener("click", function (event) {
			if (element.classList.contains("mutable-blur-explanation")) {
				element.classList.remove("mutable-blur-explanation");
				event.stopPropagation();
			}
		});
	} else if (settings.globalMuteAction === "hide") {
		element.classList.add("mutable-hide");
	} else {
		console.error(`Unknown global mute action, defaulting to 'blur': ${settings.globalMuteAction}`);
		element.classList.add("mutable-blur");
		element.addEventListener("click", function (event) {
			if (element.classList.contains("mutable-blur")) {
				element.classList.remove("mutable-blur");
				event.stopPropagation();
			}
		});
	}
}

/**
 * Reset all posts that have been hidden by Mutable.
 */
function resetPosts() {
	for (let post of document.querySelectorAll(`[${PROCESSED_INDICATOR}]`)) {
		post.removeAttribute(PROCESSED_INDICATOR);
		post.classList.remove("mutable-blur");
		post.classList.remove("mutable-hide");
		post.classList.remove("mutable-blur-explanation");
	}
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