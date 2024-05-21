import baseConfig from "@mychat/eslint-config/base";
import reactConfig from "@mychat/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
	{
		ignores: [],
	},
	...baseConfig,
	...reactConfig,
];
