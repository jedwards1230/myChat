import { queryOptions, useQuery } from "@tanstack/react-query";

import type { User } from "@/types";
import { useConfigStore } from "@/hooks/stores/configStore";
import { fetcher, FetchError } from "../../lib/fetcher";

export const userQueryOptions = (userId: string) => {
	return queryOptions({
		queryKey: [userId],
		retry: false,
		queryFn: () => fetcher<User>("/user", { userId }),
		throwOnError: (error, query) =>
			!(error instanceof FetchError || error.message === "Network request failed"),
	});
};

export const useUserQuery = () => {
	const user = useConfigStore((s) => s.user);
	return useQuery(userQueryOptions(user.id));
};
