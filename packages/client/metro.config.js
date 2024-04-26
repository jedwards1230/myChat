const path = require("path");
// Learn more https://docs.expo.io/guides/customizing-metro
const { FileStore } = require("metro-cache");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const monorepoPackages = {
	"@mychat/shared": path.resolve(workspaceRoot, "packages/shared"),
	"@mychat/eslint-config": path.resolve(workspaceRoot, "packages/eslint"),
	"@mychat/tsconfig": path.resolve(workspaceRoot, "packages/tsconfig"),
};

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

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
config.resolver.extraNodeModules = monorepoPackages;
// Use turborepo to restore the cache when possible
config.cacheStores = [
	new FileStore({ root: path.join(workspaceRoot, "node_modules", ".cache", "metro") }),
];

module.exports = withNativeWind(config, {
	input: path.resolve(projectRoot, "src/app/global.css"),
});
