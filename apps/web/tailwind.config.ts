import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

import baseConfig from "@mychat/tailwind-config/web";

const config: Config = {
	content: [...baseConfig.content, "../../packages/ui/**/*.{ts,tsx}"],
	presets: [baseConfig],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-geist-sans)", ...fontFamily.sans],
				mono: ["var(--font-geist-mono)", ...fontFamily.mono],
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [],
};
export default config;
