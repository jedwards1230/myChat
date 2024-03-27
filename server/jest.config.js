/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	globalSetup: "./tests/globalSetup.ts",
	globalTeardown: "./tests/globalTeardown.ts",
};
