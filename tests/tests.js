// Assert dependency is registered in the test script in package.json

describe('Parsing tests', () => {
	describe("Keyword mute pattern", () => {
		it('Whole content match', () => {
			const pattern = new KeywordMute("#test", "test");
			const result = pattern.isMatch("test");
			assert.isTrue(result);
		});

		it('Word surrounded by spaces', () => {
			const pattern = new KeywordMute("#test", "test");
			const result = pattern.isMatch("  test  ");
			assert.isTrue(result);
		});

		it('Beginning of sentence', () => {
			const pattern = new KeywordMute("#test", "Test");
			const result = pattern.isMatch("Test this or that.");
			assert.isTrue(result);
		});

		it('Middle of sentence', () => {
			const pattern = new KeywordMute("#test", "this");
			const result = pattern.isMatch("Test this or that.");
			assert.isTrue(result);
		});

		it('End of sentence', () => {
			const pattern = new KeywordMute("#test", "that");
			const result = pattern.isMatch("Test this or that.");
			assert.isTrue(result);
		});

		it('Case insensitivity whole word', () => {
			const pattern = new KeywordMute("#test", "TEST");
			const result = pattern.isMatch("test");
			assert.isTrue(result);
		});

		it('Case sensitive beginning of sentence', () => {
			const pattern = new KeywordMute("#test", "Test", true);
			const result = pattern.isMatch("Test this or that.");
			assert.isTrue(result);
		});

		it('Case sensitive middle of sentence', () => {
			const pattern = new KeywordMute("#test", "ThIs", true);
			const result = pattern.isMatch("Test ThIs or that.");
			assert.isTrue(result);
		});

		it('Case sensitive end of sentence', () => {
			const pattern = new KeywordMute("#test", "That", true);
			const result = pattern.isMatch("Test this or That.");
			assert.isTrue(result);
		});

		it('Symbols within word', () => {
			const symbols = "!@#$%^&*()_+-=[]{}|;':,.<>/?";
			for (let i = 0; i < symbols.length; i++) {
				const pattern = new KeywordMute("#test", "test" + symbols[i] + "test");
				const result = pattern.isMatch("test" + symbols[i] + "test");
				assert.isTrue(result, "Failed on '" + symbols[i] + "' with content: " + "test" + symbols[i] + "test");
			}
		});

		it('Surrounded by punctuation', () => {
			const pattern = new KeywordMute("#test", "test", true);
			const punctuation = ".,;:!?-_+=()[]{}'\"<>";
			for (let i = 0; i < punctuation.length; i++) {
				const result = pattern.isMatch(`${punctuation[i]}test${punctuation[i]}`);
				assert.isTrue(result, "Failed on '" + punctuation[i] + "' with content: " + `${punctuation[i]}test${punctuation[i]}`);
			}
		});

		it('Beginning of a word', () => {
			const pattern = new KeywordMute("#test", "test", true);
			const result = pattern.isMatch("testify");
			assert.isFalse(result);
		});

		it('Middle of a word', () => {
			const pattern = new KeywordMute("#test", "test", true);
			const result = pattern.isMatch("attested");
			assert.isFalse(result);
		});

		it('End of a word', () => {
			const pattern = new KeywordMute("#test", "test", true);
			const result = pattern.isMatch("attest");
			assert.isFalse(result);
		});

		it('Mute phrase', () => {
			const pattern = new KeywordMute("#test", "brown hen", true);
			const result = pattern.isMatch("the brown hen laid an egg");
			assert.isTrue(result);
		});

		it('Word with apostrophe', () => {
			const pattern = new KeywordMute("#test", "don't", true);
			const result = pattern.isMatch("I don't know");
			assert.isTrue(result);
		});

		it('Word with hyphen', () => {
			const pattern = new KeywordMute("#test", "well-being", true);
			const result = pattern.isMatch("I care for your well-being dude");
			assert.isTrue(result);
		});

		it('Word with hyphen at end of sentence', () => {
			const pattern = new KeywordMute("#test", "well-being", true);
			const result = pattern.isMatch("I care for your well-being");
			assert.isTrue(result);
		});
	});
});