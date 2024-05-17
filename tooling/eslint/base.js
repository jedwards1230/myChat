/** @type {import("eslint").Linter.Config} */
const config = {
	extends: [
		"turbo",
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier",
	],
	env: {
		es2022: true,
		node: true,
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: true,
	},
	plugins: ["@typescript-eslint", "import"],
	rules: {
		"@typescript-eslint/no-unused-vars": [
			"error",
			{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
		],
		"@typescript-eslint/consistent-type-imports": [
			"warn",
			{ prefer: "type-imports", fixStyle: "separate-type-imports" },
		],
		"@typescript-eslint/no-misused-promises": "off",
		"@typescript-eslint/no-empty-object-type": "off",
		"@typescript-eslint/strict-boolean-expressions": 0,
		"@typescript-eslint/no-explicit-any": 0,
		"@typescript-eslint/ban-ts-comment": 0,
		"@typescript-eslint/no-redeclare": "off",
		"import/consistent-type-specifier-style": "off",
		"turbo/no-undeclared-env-vars": "off",
	},
	ignorePatterns: [
		"**/.eslintrc.cjs",
		"**/*.config.js",
		"**/*.config.cjs",
		"dist",
		"yarn.lock",
		".turbo",
	],
	reportUnusedDisableDirectives: true,
};

module.exports = config;
