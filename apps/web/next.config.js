import { fileURLToPath } from "url";
import { withExpo } from "@expo/next-adapter";
import createJiti from "jiti";
import withPlugins from "next-compose-plugins";
import withTM from "next-transpile-modules";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	reactStrictMode: true,

	/** We already do linting and typechecking as separate tasks in CI */
	eslint: { ignoreDuringBuilds: true },
	typescript: { ignoreBuildErrors: true },
};

export default withPlugins(
	[
		withTM([
			"expo-clipboard",
			"nativewind",
			"react-native",
			"react-native-web",
			"solito",

			"@mychat/api",
			"@mychat/shared",
			"@mychat/db",
			"@mychat/tailwind-config",
			"@mychat/eslint-config",
			"@mychat/tsconfig",
			"@mychat/ui",
			"@mychat/views",
			"nativewind",
		]),
		[withExpo, {}],
	],
	nextConfig,
);
