import { fileURLToPath } from "url";
import { withExpo } from "@expo/next-adapter";
import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	reactStrictMode: true,

	/** Enables hot reloading for local packages without a build step */
	transpilePackages: [
		"@mychat/api",
		"@mychat/shared",
		"@mychat/db",
		"@mychat/tailwind-config",
		"@mychat/eslint-config",
		"@mychat/tsconfig",
		"@mychat/ui",
		"@mychat/views",
	],

	/** We already do linting and typechecking as separate tasks in CI */
	eslint: { ignoreDuringBuilds: true },
	typescript: { ignoreBuildErrors: true },
};

export default withExpo(nextConfig);
