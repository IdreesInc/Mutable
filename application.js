// @ts-check
/// <reference path="shared.js" />

const kittens = [
	{
		"name": "1",
		"src": "https://unsplash.com/photos/Y0WXj3xqJz0"
	},
	{
		"name": "2",
		"src": "https://unsplash.com/photos/WNoYQaAtCfo"
	},
	{
		"name": "3",
		"src": "https://unsplash.com/photos/uhnZZUaTIOs"
	},
	{
		"name": "4",
		"src": "https://unsplash.com/photos/bhonzdJMVjY"
	},
	{
		"name": "5",
		"src": "https://unsplash.com/photos/lAjk-UJa85c"
	},
	{
		"name": "6",
		"src": "https://unsplash.com/photos/klH-f7mw2Ws"
	},
	{
		"name": "7",
		"src": "https://unsplash.com/photos/_867Jy8LCkI"
	},
	{
		"name": "8",
		"src": "https://unsplash.com/photos/7nPxC8id3Ss"
	},
	{
		"name": "9",
		"src": "https://unsplash.com/photos/eSceitc-s30"
	},
	{
		"name": "10",
		"src": "https://unsplash.com/photos/MJymGVEazyY"
	},
	{
		"name": "11",
		"src": "https://unsplash.com/photos/jMOSPjsZXtg"
	},
	{
		"name": "12",
		"src": "https://unsplash.com/photos/ZJWUZ6JKAF0"
	},
	{
		"name": "13",
		"src": "https://unsplash.com/photos/rxvocsh0DUw"
	},
	{
		"name": "14",
		"src": "https://unsplash.com/photos/OmWw4SfE2DI"
	},
	{
		"name": "15",
		"src": "https://unsplash.com/photos/Px2Y-sio6-c"
	},
	{
		"name": "16",
		"src": "https://unsplash.com/photos/bXnoQq1sIBM"
	},
	{
		"name": "17",
		"src": "https://unsplash.com/photos/WHTLPrTPBk0"
	},
	{
		"name": "18",
		"src": "https://unsplash.com/photos/7qNZYwUbPic"
	},
	{
		"name": "19",
		"src": "https://unsplash.com/photos/VpzlatUJFfo"
	},
	{
		"name": "20",
		"src": "https://unsplash.com/photos/SAKLELG-pO8"
	}
];

/** @type {Settings} */
let settings = new Settings();
let shuffledBag = [];

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
	} else if (settings.globalMuteAction === "kittens") {
		element.classList.add("mutable-kittens");
		const kittenSrc = `./images/kittens/${kittens[getIndexFromBag(kittens.length)].name}.jpg`;
		element.style.setProperty("--overlay-image", `url("${kittenSrc}")`);
		element.addEventListener("click", function (event) {
			if (element.classList.contains("mutable-kittens")) {
				element.classList.remove("mutable-kittens");
				element.style.setProperty("--overlay-image", "");
				event.stopPropagation();
			}
		});
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
 * Get a random index from the bag.
 * @param {number} listSize
 * @returns {number} A random index less than listSize
 */
function getIndexFromBag(listSize) {
	if (shuffledBag.length === 0) {
		for (let i = 0; i < listSize; i++) {
			shuffledBag.push(i);
		}
		shuffledBag = shuffle(shuffledBag);
	}
	return shuffledBag.pop() % listSize;
}

/**
 * Fisher-Yates shuffle.
 * https://stackoverflow.com/a/2450976/1330144
 * @param {Array.<T>} array
 * @returns {Array.<T>}
 * @template T
 */
function shuffle(array) {
	let currentIndex = array.length,  randomIndex;
	// While there remain elements to shuffle.
	while (currentIndex != 0) {
	  // Pick a remaining element.
	  randomIndex = Math.floor(Math.random() * currentIndex);
	  currentIndex--;
	  // And swap it with the current element.
	  [array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];
	}
	return array;
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