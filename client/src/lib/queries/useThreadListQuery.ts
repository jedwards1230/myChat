import { useQuery } from "@tanstack/react-query";

import { Thread } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { useConfigStore } from "@/lib/stores/configStore";

const fetchThreadList = (userId: string, init?: FetchRequestInit) => () =>
	fetcher<Thread[]>(["/threads", userId], init);

export const useThreadListQuery = () => {
	const user = useConfigStore((s) => s.user);
	return useQuery({
		queryKey: [user.id, "threads"],
		queryFn: fetchThreadList(user.id),
	});
};
