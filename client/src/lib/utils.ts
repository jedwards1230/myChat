import { clsx, type ClassValue } from "clsx";
import { Platform } from "react-native";
import { twMerge } from "tailwind-merge";

const IS_DEV = process.env.NODE_ENV === "development";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const BASE_HOST = Platform.select({
	web: IS_DEV ? "http://localhost:3000" : "",
	default: process.env.EXPO_PUBLIC_API_URL,
});

type AuthParams = [url: string, userId: string];

export class FetchError extends Error {
	constructor(public res: Response | XMLHttpRequest, message?: string) {
		super(message);
	}

	get status() {
		if (this.res instanceof Response) {
			return this.res.status;
		} else if (this.res instanceof XMLHttpRequest) {
			return this.res.status;
		}
		return undefined;
	}
}

/**
 * Fetcher for react-query.
 * It sets the Authorization header with the userId
 * */
export async function fetcher<T = any>(
	[url, userId]: AuthParams,
	init?: FetchRequestInit | undefined,
	stream = false
): Promise<T> {
	try {
		const res = await fetch(BASE_HOST + "/api" + url, {
			...init,
			headers: {
				"Content-Type": "application/json",
				Authorization: userId,
				...(init?.headers || {}),
			},
		});
		if (res.ok) {
			return stream ? res : res.json();
		}
		throw new FetchError(res, `HTTP error! status: ${res.status}`);
	} catch (error) {
		throw error;
	}
}
