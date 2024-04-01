import { type ConfigContext, ExpoConfig } from "expo/config";

const OWNER = process.env.OWNER;
const PROJECT_ID = process.env.PROJECT_ID;

const IS_PROD =
	process.env.APP_VARIANT === "production" || process.env.APP_VARIANT === "preview";

const PACKAGE_NAME = IS_PROD ? "myChat" : "myChat-dev";
const PACKAGE_BUNDLE = IS_PROD ? "com.project.myChat" : "com.project.myChat.dev";

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: PACKAGE_NAME,
	slug: "mychat",
	version: "1.0.0",
	runtimeVersion: "0.0.1",
	orientation: "portrait",
	icon: "./assets/images/icon.png",
	scheme: PACKAGE_NAME,
	userInterfaceStyle: "automatic",
	splash: {
		image: "./assets/images/splash.png",
		resizeMode: "contain",
		backgroundColor: "#ffffff",
	},
	assetBundlePatterns: ["assets/**/*"],
	ios: {
		supportsTablet: true,
		bundleIdentifier: PACKAGE_BUNDLE,
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
		output: "static",
		favicon: "./assets/images/favicon.png",
	},
	plugins: [
		[
			"expo-router",
			{
				asyncRoutes: false,
			},
		],
		[
			"expo-document-picker",
			{
				iCloudContainerEnvironment: "Production",
			},
		],
		[
			"expo-updates",
			{
				username: "account-username",
			},
		],
		[
			"expo-build-properties",
			{
				ios: {
					flipper: true,
				},
			},
		],
	],
	experiments: {
		typedRoutes: true,
	},
	owner: OWNER,
	extra: {
		eas: {
			projectId: PROJECT_ID,
		},
	},
});
