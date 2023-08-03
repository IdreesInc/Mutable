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
	});
	// Every 5 seconds, parse the page for new posts
	setInterval(() => {
		parse();
	}, 5000);
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