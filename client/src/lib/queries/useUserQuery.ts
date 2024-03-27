import { useQuery } from "@tanstack/react-query";

import type { User } from "@/types";
import { fetcher, FetchError } from "../utils";
import { useConfigStore } from "@/lib/stores/configStore";

const fetchUser = (userId: string, init?: FetchRequestInit) => () =>
	fetcher<User>(["/user", userId], init);

export const useUserQuery = () => {
	const user = useConfigStore((s) => s.user);
	const queryKey = [user.id];

	return useQuery({
		queryKey,
		queryFn: fetchUser(user.id),
		retry: false,
		throwOnError: (error, query) =>
			!(error instanceof FetchError || error.message === "Network request failed"),
	});
};