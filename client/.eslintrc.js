module.exports = {
	root: true,
	extends: [
		"eslint:recommended",
		"react-app",
		"plugin:@tanstack/eslint-plugin-query/recommended",
	],
	rules: {
		"react-hooks/exhaustive-deps": "off",
		"@typescript-eslint/no-redeclare": "off",
	},
};
