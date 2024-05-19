const path = require("path");
// Learn more https://docs.expo.io/guides/customizing-metro
const { FileStore } = require("metro-cache");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const monorepoPackages = {
	"@mychat/shared": path.resolve(workspaceRoot, "packages/shared"),
	"@mychat/eslint-config": path.resolve(workspaceRoot, "tooling/eslint"),
	"@mychat/tsconfig": path.resolve(workspaceRoot, "tooling/tsconfig"),
};

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

module.exports = withTurborepoManagedCache(
	withMonorepoPaths(
		withNativeWind(config, {
			input: path.resolve(projectRoot, "src/app/global.css"),
		}),
	),
);

/**
 * Add the monorepo paths to the Metro config.
 * This allows Metro to resolve modules from the monorepo.
 *
 * @see https://docs.expo.dev/guides/monorepos/#modify-the-metro-config
 * @param {import('expo/metro-config').MetroConfig} config
 * @returns {import('expo/metro-config').MetroConfig}
 */
function withMonorepoPaths(config) {
	const projectRoot = __dirname;
	const workspaceRoot = path.resolve(projectRoot, "../..");

	config.transformer.assetPlugins = ["expo-asset/tools/hashAssetFiles"];

	// #1 - Watch all files in the monorepo
	config.watchFolders = [projectRoot, ...Object.values(monorepoPackages)];

	// #2 - Force resolving nested modules to the folders below
	config.resolver.disableHierarchicalLookup = true;

	// #3 - Try resolving with workspace modules first, then project modules
	config.resolver.nodeModulesPaths = [
		path.resolve(projectRoot, "node_modules"),
		path.resolve(workspaceRoot, "node_modules"),
	];

	// #4 - Add the monorepo packages to the extraNodeModules
	config.resolver.extraNodeModules = monorepoPackages;

	// #5 - Enable symlinks for the monorepo packages
	config.resolver.unstable_enableSymlinks = true;

	return config;
}

/**
 * Move the Metro cache to the `node_modules/.cache/metro` folder.
 * This repository configured Turborepo to use this cache location as well.
 * If you have any environment variables, you can configure Turborepo to invalidate it when needed.
 *
 * @see https://turbo.build/repo/docs/reference/configuration#env
 * @param {import('expo/metro-config').MetroConfig} config
 * @returns {import('expo/metro-config').MetroConfig}
 */
function withTurborepoManagedCache(config) {
	config.cacheStores = [
		new FileStore({
			root: path.join(workspaceRoot, "node_modules", ".cache", "metro"),
		}),
	];
	return config;
}
