import { queryOptions, useQuery } from "@tanstack/react-query";

import type { User, UserSession } from "@/types";
import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";

export const userQueryOptions = (apiKey: string) => {
	return queryOptions({
		queryKey: ["user", apiKey],
		queryFn: () => fetcher<User>("/user", { apiKey }),
	});
};

export const userSessionQueryOptions = (apiKey: string, sessionId: string | null) => {
	return queryOptions({
		queryKey: ["session", sessionId, apiKey],
		enabled: sessionId !== null,
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
