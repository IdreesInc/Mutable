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
			const imageContainers = $(this.postElement).find(".expo-image-container").parent().each((index, element) => {
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

const PROCESSED_INDICATOR = "mutable-parsed";

const muteList = ["watercolor", "threads"];

init();

function init() {
	log("Mutable has been loaded successfully!");
	document.addEventListener("keydown", function (event) {
		if (event.code === "Space") {
			parse();
		}
	});
}

function parse() {
	if (window.location.host === "bsky.app") {
		let posts = new BlueskyParser().getPosts();
		log(`Found ${posts.length} posts`)
		for (let post of posts) {
			post.postElement.setAttribute(PROCESSED_INDICATOR, "true");
			const contents = post.postContents();
			log(post.authorName());
			if (contents && muteList.some((word) => contents.includes(word))) {
				hidePost(post.postElement);
				continue;
			}
			const altTexts = post.mediaAltText();
			if (altTexts) {
				for (let altText of altTexts) {
					if (altText && muteList.some((word) => altText.includes(word))) {
						hidePost(post.postElement);
						break;
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