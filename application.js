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
const puppies = [
	{
		"name": "1",
		"src": "https://unsplash.com/photos/fk4tiMlDFF0"
	},
	{
		"name": "2",
		"src": "https://unsplash.com/photos/9LkqymZFLrE"
	},
	{
		"name": "3",
		"src": "https://unsplash.com/photos/atOlntWcO4k"
	},
	{
		"name": "4",
		"src": "https://unsplash.com/photos/Qb7D1xw28Co"
	},
	{
		"name": "5",
		"src": "https://unsplash.com/photos/k4vhuUHv08o"
	},
	{
		"name": "6",
		"src": "https://unsplash.com/photos/eoqnr8ikwFE"
	},
	{
		"name": "7",
		"src": "https://unsplash.com/photos/wxfZi8eYdEk"
	},
	{
		"name": "8",
		"src": "https://unsplash.com/photos/m8v7BDLV8yE"
	},
	{
		"name": "9",
		"src": "https://unsplash.com/photos/z_U6bPp_Rjg"
	},
	{
		"name": "10",
		"src": "https://unsplash.com/photos/zr0beNrnvgQ"
	},
	{
		"name": "11",
		"src": "https://unsplash.com/photos/vMNr5gbeeTk"
	},
	{
		"name": "12",
		"src": "https://unsplash.com/photos/ORzQG8jKOO4"
	},
	{
		"name": "13",
		"src": "https://unsplash.com/photos/TzjMd7i5WQI"
	},
	{
		"name": "14",
		"src": "https://unsplash.com/photos/DsGeUBaJPwc"
	},
	{
		"name": "15",
		"src": "https://unsplash.com/photos/JK8w20Zantg"
	},
	{
		"name": "16",
		"src": "https://unsplash.com/photos/oO5MBxRCadY"
	},
	{
		"name": "17",
		"src": "https://unsplash.com/photos/6uPsI12Xqjk"
	},
	{
		"name": "18",
		"src": "https://unsplash.com/photos/AsCYNjt6IF0"
	},
	{
		"name": "19",
		"src": "https://unsplash.com/photos/7T8ammfU8-s"
	},
	{
		"name": "20",
		"src": "https://unsplash.com/photos/VQPD1fc_Y8g"
	}
];
const hedgehogs = [
	{
		"name": "1",
		"src": "https://unsplash.com/photos/D09Nooc3XQw"
	},
	{
		"name": "2",
		"src": "https://unsplash.com/photos/OMCgkp1oZ3Q"
	},
	{
		"name": "3",
		"src": "https://unsplash.com/photos/aM7r5lqKhiY"
	},
	{
		"name": "4",
		"src": "https://unsplash.com/photos/eHMLxD3W_m4"
	},
	{
		"name": "5",
		"src": "https://unsplash.com/photos/8wkkhqEYN0A"
	},
	{
		"name": "6",
		"src": "https://unsplash.com/photos/k_E7DpVgftw"
	},
	{
		"name": "7",
		"src": "https://unsplash.com/photos/iJ9o00UeAWk"
	},
	{
		"name": "8",
		"src": "https://unsplash.com/photos/GXMr7BadXQo"
	},
	{
		"name": "9",
		"src": "https://unsplash.com/photos/dktikEL51dM"
	},
	{
		"name": "10",
		"src": "https://unsplash.com/photos/g5tj75PJ4w4"
	},
	{
		"name": "11",
		"src": "https://unsplash.com/photos/MrCsc_ZL5dU"
	},
	{
		"name": "12",
		"src": "https://unsplash.com/photos/QWELA5fl1KY"
	},
	{
		"name": "13",
		"src": "https://unsplash.com/photos/6apx2KP_SEo"
	},
	{
		"name": "14",
		"src": "https://unsplash.com/photos/zjHbH8vkhgk"
	},
	{
		"name": "15",
		"src": "https://unsplash.com/photos/S6BR5GOqB4A"
	},
	{
		"name": "16",
		"src": "https://unsplash.com/photos/60QYdXjUd8o"
	},
	{
		"name": "17",
		"src": "https://unsplash.com/photos/lO9UKYIbV_g"
	},
	{
		"name": "18",
		"src": "https://unsplash.com/photos/qbFyc2w9q90"
	},
	{
		"name": "19",
		"src": "https://unsplash.com/photos/jczICIeZtos"
	},
	{
		"name": "20",
		"src": "https://unsplash.com/photos/JnZWFenBmx0"
	}
];

/** @type {Settings} */
let settings = new Settings();
let shuffledBag = [];
/** @type {HTMLElement|undefined} */
let debugWindow;
/** @type {HTMLElement|undefined} */
let debugHost;
/** @type {HTMLElement|undefined} */
let debugParsers;
/** @type {HTMLElement|undefined} */
let debugTotalPosts;
/** @type {HTMLElement|undefined} */
let debugPostsMuted;

let totalPostCount = 0;
let totalPostsMuted = 0;

init();

function init() {
	debug("Mutable has been loaded successfully!");
	getSettings((result) => {
		console.log("Settings loaded");
		settings = result;
		initParsing();
	}, (msg) => {
		console.error(msg);
		console.log("No settings found, creating default settings");
		initParsing();
	});
	subscribeToSettings((result) => {
		debug("Settings updated");
		resetPosts();
		settings = result;
		if (settings.debugMode) {
			createDebugWindow();
		} else {
			removeDebugWindow();
		}
	});
}

/**
 * Create the debug window element.
 */
function createDebugWindow() {
	if (document.getElementById("mutable-debug-window")) {
		document.getElementById("mutable-debug-window")?.remove();
	}
	debugWindow = document.createElement("div");
	debugWindow.id = "mutable-debug-window";
	const title = document.createElement("div");
	title.textContent = "Mutable Debug Window";
	title.classList.add("mutable-debug-title");
	debugWindow.appendChild(title);
	debugHost = document.createElement("div");
	debugHost.classList.add("mutable-debug-item");
	debugWindow.appendChild(debugHost);
	debugParsers = document.createElement("div");
	debugParsers.classList.add("mutable-debug-item");
	debugWindow.appendChild(debugParsers);
	debugTotalPosts = document.createElement("div");
	debugTotalPosts.classList.add("mutable-debug-item");
	debugWindow.appendChild(debugTotalPosts);
	debugPostsMuted = document.createElement("div");
	debugPostsMuted.classList.add("mutable-debug-item");
	debugWindow.appendChild(debugPostsMuted);
	document.body.appendChild(debugWindow);
	debug("Debug window created");
}

/**
 * Update the values in the debug window.
 * @param {string} parserNames
 */
function updateDebugWindow(parserNames) {
	if (!settings.debugMode) {
		removeDebugWindow();
		return;
	}
	if (!debugWindow) {
		createDebugWindow();
	}
	if (debugHost) {
		debugHost.textContent = "Host: " + window.location.hostname;
	}
	if (debugParsers) {
		debugParsers.textContent = "Parsers: " + parserNames;
	}
	if (debugTotalPosts) {
		debugTotalPosts.textContent = "Posts Found: " + totalPostCount;
	}
	if (debugPostsMuted) {
		debugPostsMuted.textContent = "Posts Muted: " + totalPostsMuted;
	}
}

/**
 * Remove the debug window element.
 */
function removeDebugWindow() {
	if (debugWindow) {
		debugWindow.remove();
		debugWindow = undefined;
		debug("Debug window removed");
	}
	// Remove the debug class from all posts
	for (let post of document.querySelectorAll(".mutable-debug-post")) {
		post.classList.remove("mutable-debug-post");
	}
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
	let posts = [];
	/** @type {string[]} */
	let parsersApplied = [];
	for (let parser of Parser.specializedParsers()) {
		if (parser.appliesToPage() && !settings.isDisabled(parser.id)) {
			console.log(`Applying parser: ${parser.parserName}`);
			posts.push(...parser.getPosts());
			parsersApplied.push(parser.parserName);
		}
	}
	totalPostCount += posts.length;
	// If no specialized parser has found any posts on this site so far, use the universal parser
	if (totalPostCount === 0 && !settings.isDisabled(UniversalParser.id)) {
		debug(`Applying universal parser`);
		posts.push(...UniversalParser.getPosts());
		parsersApplied.push(UniversalParser.parserName);
	}
	if (parsersApplied.length > 0) {
		debug(`Found ${posts.length} posts on ${parsersApplied.join(", ")}`);
		for (let post of posts) {
			post.postElement.setAttribute(PROCESSED_INDICATOR, "true");
			if (settings.debugMode && !post.postElement.classList.contains("mutable-debug-post")) {
				// console.log(post.authorHandle());
				// console.log(post.authorName());
				// console.log(post.postContents());
				if (!parsersApplied.includes(UniversalParser.parserName)) {
					post.postElement.classList.add("mutable-debug-post");
					// Add tooltip with debug info
					post.postElement.setAttribute("title", `Author: ${post.authorName()}\nHandle: ${post.authorHandle()}\nAlt: ${post.mediaAltText()}\nContents: ${post.postContents()?.substring(0, 100)}`);
				}
			}
			let matchText = match(post);
			if (matchText !== null) {
				hidePost(post.postElement, matchText);
				totalPostsMuted++;
			}
		}
	}
	updateDebugWindow(parsersApplied.length > 0 ? parsersApplied.join(", ") : "none");
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
				event.preventDefault();
				// Remove from children too
				for (let child of element.querySelectorAll(".mutable-blur")) {
					if (child instanceof HTMLElement) {
						child.classList.remove("mutable-blur");
					}
				}
			}
		});
	} else if (settings.globalMuteAction === "blur-preview") {
		element.classList.add("mutable-blur-explanation");
		element.setAttribute("data-mutable-match", reason);
		element.addEventListener("click", function (event) {
			if (element.classList.contains("mutable-blur-explanation")) {
				element.classList.remove("mutable-blur-explanation");
				event.stopPropagation();
				event.preventDefault();
				// Remove from children too
				for (let child of element.querySelectorAll(".mutable-blur-explanation")) {
					if (child instanceof HTMLElement) {
						child.classList.remove("mutable-blur-explanation");
					}
				}
			}
		});
	} else if (settings.globalMuteAction === "hide") {
		element.classList.add("mutable-hide");
	} else if (settings.globalMuteAction === "kittens") {
		element.classList.add("mutable-image-overlay");
		const kittenSrc = chrome.runtime.getURL(`./images/kittens/${kittens[getIndexFromBag(kittens.length)].name}.jpg`);
		element.style.setProperty("--overlay-image", `url("${kittenSrc}")`);
		element.addEventListener("click", function (event) {
			removeOverlay(element, event);
		});
	} else if (settings.globalMuteAction === "puppies") {
		element.classList.add("mutable-image-overlay");
		const puppySrc = chrome.runtime.getURL(`./images/puppies/${puppies[getIndexFromBag(puppies.length)].name}.jpg`);
		element.style.setProperty("--overlay-image", `url("${puppySrc}")`);
		element.addEventListener("click", function (event) {
			removeOverlay(element, event);
		});
	} else if (settings.globalMuteAction === "hedgehogs") {
		element.classList.add("mutable-image-overlay");
		const hedgehogSrc = chrome.runtime.getURL(`./images/hedgehogs/${hedgehogs[getIndexFromBag(hedgehogs.length)].name}.jpg`);
		element.style.setProperty("--overlay-image", `url("${hedgehogSrc}")`);
		element.addEventListener("click", function (event) {
			removeOverlay(element, event);
		});
	} else {
		console.error(`Unknown global mute action, defaulting to 'blur': ${settings.globalMuteAction}`);
		element.classList.add("mutable-blur");
		element.addEventListener("click", function (event) {
			if (element.classList.contains("mutable-blur")) {
				element.classList.remove("mutable-blur");
				event.stopPropagation();
				event.preventDefault();
			}
		});
	}
}

/**
 * @param {HTMLElement} element
 * @param {MouseEvent} event
 */
function removeOverlay(element, event) {
	if (element.classList.contains("mutable-image-overlay")) {
		element.classList.remove("mutable-image-overlay");
		element.style.setProperty("--overlay-image", "");
		event.stopPropagation();
		event.preventDefault();
		// Remove from children too
		for (let child of element.querySelectorAll(".mutable-image-overlay")) {
			if (child instanceof HTMLElement) {
				child.classList.remove("mutable-image-overlay");
				child.style.setProperty("--overlay-image", "");
			}
		}
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
		post.classList.remove("mutable-image-overlay");
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
function debug(message) {
	if (settings.debugMode) {
		console.debug(`Mutable: ${message}`);
	}
}

/**
 * @param {any} message
 */
function error(message) {
	console.error(`Mutable: ${message}`);
}
