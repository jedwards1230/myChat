import baseConfig from "@mychat/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
	{
		ignores: ["dist/**", "scripts/**", "tests/**"],
	},
	...baseConfig,
];