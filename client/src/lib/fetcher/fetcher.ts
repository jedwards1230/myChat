import { AuthParams, FetchError, FetcherRequestInit } from "./types";
import { BASE_HOST } from "./utils";

/**
 * Fetcher for react-query.
 * It sets the Authorization header with the userId
 * */
export async function fetcher<T = any>(
	[url, userId]: AuthParams,
	{ stream, file, ...init }: FetcherRequestInit = {
		stream: false,
		file: false,
	}
): Promise<T> {
	try {
		const res = await fetch(BASE_HOST + "/api" + url, {
			...init,
			headers: {
				...(!file && { "Content-Type": "application/json" }),
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
