import { Platform } from "react-native";

export type AuthParams = [url: string, userId: string];

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

export type FetcherRequestInit = FetchRequestInit & {
	/** If true, returns raw Response. If false, returns JSON Response. */
	stream?: boolean;
	/** If true, removes default "Content-Type" header (Default: false) */
	file?: boolean;
	/** userId for Authorization header */
	userId?: string;
};

export const BASE_HOST =
	Platform.select({
		web: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "",
		default: process.env.EXPO_PUBLIC_API_URL,
	}) + "/api";

/**
 * Fetcher for react-query.
 * Sets the Authorization header with the userId
 * */
export async function fetcher<T = any>(
	url: string | URL | Request,
	{ stream, file, userId, ...init }: FetcherRequestInit = {
		stream: false,
		file: false,
	}
): Promise<T> {
	try {
		const res = await fetch(BASE_HOST + url, {
			...init,
			headers: {
				...(!file && { "Content-Type": "application/json" }),
				...(userId && { Authorization: userId }),
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
