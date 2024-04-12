import { queryOptions, useQuery } from "@tanstack/react-query";

import type { User } from "@/types";
import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher, FetchError } from "../../lib/fetcher";

export const userQueryOptions = (apiKey: string) => {
	return queryOptions({
		queryKey: ["user"],
		retry: false,
		queryFn: () => fetcher<User>("/user", { apiKey }),
		throwOnError: (error, query) =>
			!(error instanceof FetchError || error.message === "Network request failed"),
	});
};

export const useUserQuery = () => {
	const apiKey = useUserData((s) => s.apiKey);
	try {
		return useQuery(userQueryOptions(apiKey));
	} catch (error) {
		return null;
	}
};
