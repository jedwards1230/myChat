import { fileURLToPath } from "url";
import { withExpo } from "@expo/next-adapter";
import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
	//output: "standalone",
	//reactStrictMode: true,

	/** We already do linting and typechecking as separate tasks in CI */
	eslint: { ignoreDuringBuilds: true },
	typescript: { ignoreBuildErrors: true },

	transpilePackages: [
		"@mychat/api",
		"@mychat/db",
		"@mychat/eslint-config",
		"@mychat/shared",
		"@mychat/tailwind-config",
		"@mychat/tsconfig",
		"@mychat/ui",
		"@mychat/views",
		"@react-navigation/drawer",
		"@react-navigation/native",
		"@react-navigation/native-stack",
		"expo-clipboard",
		"nativewind",
		"react-native",
		"react-native-css-interop",
		"react-native-gesture-handler",
		"react-native-reanimated",
		"react-native-safe-area-context",
		"react-native-screens",
		"react-native-web",
		"solito",
		"zod",
	],

	experimental: {
		//reactCompiler: true,
	},
};

export default withExpo(nextConfig);
