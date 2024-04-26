module.exports = {
	root: true,
	extends: [
		"@mychat/eslint-config",
		//"react-app",
		//"plugin:@tanstack/eslint-plugin-query/recommended",
	],
	rules: {
		"react-hooks/exhaustive-deps": "off",
		"@typescript-eslint/consistent-type-imports": "error",
	},
	ignorePatterns: [
		".expo",
		"ios",
		"src/**/*.test.ts",
		"tailwind.config.js",
		"metro.config.js",
		"babel.config.js",
		"app.config.ts",
	],
};
