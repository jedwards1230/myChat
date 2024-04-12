import { Platform } from "react-native";
// @ts-ignore
import { Client, Account, ID } from "react-native-appwrite";
import Appwrite from "appwrite";

const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "http://localhost/v1";
const project = process.env.EXPO_PUBLIC_APPWRITE_PROJECT || "project-id";
const bundleName = Platform.select({
	ios: process.env.EXPO_PUBLIC_APPWRITE_IOS_BUNDLE || "com.example.app",
	android: process.env.EXPO_PUBLIC_APPWRITE_ANDROID_BUNDLE || "com.example.app",
	web: process.env.EXPO_PUBLIC_APPWRITE_WEB_BUNDLE || "com.example.app",
	default: "com.example.app",
});

export const appwriteClient = new Client()
	.setEndpoint(endpoint)
	.setProject(project)
	.setPlatform(bundleName) as Appwrite.Client;

const accountManager = new Account(appwriteClient) as Appwrite.Account;

export async function createUser(email: string, password: string) {
	return accountManager.create(ID.unique(), email, password);
}

export async function loginUser(email: string, password: string) {
	return (accountManager as any).createEmailSession(email, password) as Promise<
		ReturnType<Appwrite.Account["createEmailPasswordSession"]>
	>;
}
