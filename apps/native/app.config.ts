import type { ConfigContext, ExpoConfig } from "expo/config";

const OWNER = process.env.OWNER;

const IS_PROD =
	process.env.APP_VARIANT === "production" || process.env.APP_VARIANT === "preview";

const PACKAGE_NAME = IS_PROD ? "myChat" : "myChat-dev";
const PACKAGE_BUNDLE = IS_PROD ? "com.project.myChat" : "com.project.myChat.dev";

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	slug: PACKAGE_NAME,
	version: "1.0.0",
	name: PACKAGE_NAME,
	scheme: PACKAGE_NAME,
	orientation: "portrait",
	userInterfaceStyle: "automatic",
	assetBundlePatterns: ["assets/**/*"],
	icon: "./assets/images/icon.png",
	splash: {
		image: "./assets/images/splash.png",
		resizeMode: "contain",
		backgroundColor: "#ffffff",
	},
	ios: {
		supportsTablet: true,
		bundleIdentifier: PACKAGE_BUNDLE,
		privacyManifests: {
			NSPrivacyAccessedAPITypes: [
				{
					NSPrivacyAccessedAPIType: "NSPrivacyAccessedAPICategoryUserDefaults",
					NSPrivacyAccessedAPITypeReasons: ["CA92.1"],
				},
			],
		},
	},
	android: {
		package: PACKAGE_BUNDLE,
		adaptiveIcon: {
			foregroundImage: "./assets/images/adaptive-icon.png",
			backgroundColor: "#ffffff",
		},
	},
	web: {
		bundler: "metro",
		output: "single",
		favicon: "./assets/images/favicon.png",
	},
	plugins: [
		"expo-font",
		["expo-router", { asyncRoutes: false }],
		["expo-document-picker", { iCloudContainerEnvironment: "Production" }],
		["expo-updates", { username: "account-username" }],
	],
	experiments: { typedRoutes: true },
	owner: OWNER,
	extra: { eas: { projectId: "6dd9e755-8579-4148-8591-94a3d882d7f5" } },
});
