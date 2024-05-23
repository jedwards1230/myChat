/// <reference types="./types.d.ts" />

import eslint from "@eslint/js";
import prettierPlugin from "eslint-config-prettier";
// @ts-ignore
import turboPlugin from "eslint-config-turbo";
import importPlugin from "eslint-plugin-import";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		// Globally ignored files
		ignores: ["**/.eslintrc.js", "**/*.config.js", "dist", "bun.lockb", ".turbo"],
	},
	{
		files: ["**/*.js", "**/*.ts", "**/*.tsx"],
		plugins: {
			import: importPlugin,
			turbo: turboPlugin,
		},
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommended,
			...tseslint.configs.recommendedTypeChecked,
			...tseslint.configs.stylisticTypeChecked,
			prettierPlugin,
		],
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"error",
				{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
			],
			"@typescript-eslint/consistent-type-imports": [
				"warn",
				{ prefer: "type-imports", fixStyle: "separate-type-imports" },
			],
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-misused-promises": "off",
			"@typescript-eslint/no-non-null-assertion": "error",
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/strict-boolean-expressions": 0,
			"@typescript-eslint/no-unsafe-argument": 0,
			"@typescript-eslint/no-empty-function": 0,
			"@typescript-eslint/no-floating-promises": 0,
			"@typescript-eslint/no-unsafe-return": 0,
			"@typescript-eslint/unbound-method": 0,
			"@typescript-eslint/require-await": 0,
			"@typescript-eslint/no-unsafe-call": 0,
			"@typescript-eslint/no-unnecessary-condition": 0,
			"@typescript-eslint/no-explicit-any": 0,
			"@typescript-eslint/ban-ts-comment": 0,
			"@typescript-eslint/no-redeclare": "off",
			"import/consistent-type-specifier-style": "off",
			"turbo/no-undeclared-env-vars": "off",
		},
	},
	{
		linterOptions: { reportUnusedDisableDirectives: true },
		languageOptions: { parserOptions: { project: true } },
		settings: {
			"import/ignore": ["node_modules(\\\\|/)react-native(\\\\|/)index\\.js$"],
		},
	},
);
