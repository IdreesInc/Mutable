// @ts-check
/// <reference path="shared.js" />

const PROCESSED_INDICATOR = "mutable-parsed";
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
		if (match(post)) {
			hidePost(post.postElement);
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
	element.classList.add("mutable-blur");
	element.addEventListener("click", function (event) {
		if (element.classList.contains("mutable-blur")) {
			element.classList.remove("mutable-blur");
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