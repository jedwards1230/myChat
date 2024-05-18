/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",

	/** Enables hot reloading for local packages without a build step */
	transpilePackages: ["@mychat/agents", "@mychat/shared", "@mychat/db"],

	/** We already do linting and typechecking as separate tasks in CI */
	eslint: { ignoreDuringBuilds: true },
	typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
