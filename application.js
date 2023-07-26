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
			error(ex);
			error("Could not find author name");
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
			error(ex);
			error("Could not find author name");
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
			error(ex);
			error("Could not find media alt text");
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

class MutePattern {
	/**
	 * Determine whether the provided text matches this pattern.
	 * @abstract
	 * @param {string} contents The contents to test the match against
	 * @returns {boolean} Whether the text matches this pattern
	 */
	isMatch(contents) {
		return false;
	}
}

class Keyword extends MutePattern {
	/**
	 * @param {string} word
	 */
	constructor(word, caseSensitive = false) {
		super();
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
}

class Group {
	/**
	 * @param {MutePattern[]} patterns
	 */
	constructor(patterns) {
		this.patterns = patterns;
	}
}

const PROCESSED_INDICATOR = "mutable-parsed";
/** @type {Group[]} */
let groups = [];

init();

function init() {
	log("Mutable has been loaded successfully!");
	initGroups();
	document.addEventListener("keydown", function (event) {
		if (event.code === "Space") {
			parse();
		}
	});
}

function initGroups() {
	const defaultGroup = new Group([
		new Keyword("watercolor"),
		new Keyword("threads"),
		new Keyword("david"),
		new Keyword("need"),
	]);
	groups.push(defaultGroup);
}

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
 * @param {Post} post
 */
function match(post) {
	const contents = post.postContents();
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