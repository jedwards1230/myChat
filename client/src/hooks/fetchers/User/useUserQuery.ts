import { queryOptions, useQuery } from "@tanstack/react-query";

import type { User, UserSession } from "@/types";
import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";

export const userQueryOptions = (apiKey: string) => {
	return queryOptions({
		queryKey: ["user"],
		retry: false,
		queryFn: () => fetcher<User>("/user", { apiKey }),
		throwOnError: (error, query) =>
			error.name !== "FetchError" || error.message === "Network request failed",
	});
};

export const userSessionQueryOptions = (apiKey: string, sessionId: string | null) => {
	return queryOptions({
		queryKey: ["session"],
		enabled: !!sessionId,
		retry: false,
		queryFn: () => fetcher<UserSession>(`/user/session/${sessionId}`, { apiKey }),
	});
};

export const useUserQuery = () => {
	const apiKey = useUserData((s) => s.apiKey);
	return useQuery(userQueryOptions(apiKey));
};

export const useUserSessionQuery = (sessionId: string | null) => {
	const apiKey = useUserData((s) => s.apiKey);
	return useQuery(userSessionQueryOptions(apiKey, sessionId));
};
