// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.transformer.assetPlugins = ["expo-asset/tools/hashAssetFiles"];

module.exports = withNativeWind(config, { input: "./src/app/global.css" });
