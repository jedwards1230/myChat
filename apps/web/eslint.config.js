import baseConfig from "@mychat/eslint-config/base";
import nextjsConfig from "@mychat/eslint-config/nextjs";
import reactConfig from "@mychat/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
	{
		ignores: [".next/**"],
	},
	...baseConfig,
	...reactConfig,
	...nextjsConfig,
];
