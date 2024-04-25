//import eslintConfig from "@typescript-eslint";

module.exports = {
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"eslint-config-universe",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: { project: ["./tsconfig.json"] },
	plugins: ["@typescript-eslint"],
	rules: {
		//"prettier/prettier": ["error", { endOfLine: "auto" }],
		"@typescript-eslint/strict-boolean-expressions": 0,
		"@typescript-eslint/no-explicit-any": 0,
		"@typescript-eslint/ban-ts-comment": 0,
	},
	// Disable import/namespace due to https://github.com/facebook/react-native/issues/28549
	// By setting delimiters to `\|/`, this ignore is supported on Windows too
	settings: {
		"import/ignore": ["node_modules(\\\\|/)react-native(\\\\|/)index\\.js$"],
	},
};

/* const plugin = {
	name: "@mychat/eslint-plugin",
	configs: {},
	rules: {
		//"prettier/prettier": ["error", { endOfLine: "auto" }],
		"@typescript-eslint/strict-boolean-expressions": 0,
		"@typescript-eslint/no-explicit-any": 0,
		"@typescript-eslint/ban-ts-comment": 0,
	},
	plugins: {
		eslintConfig,
	},
	processors: {},
};

export default plugin; */
