import { Thread } from "@/types";
import { fetcher } from "../utils";
import { useConfigStore } from "@/lib/stores/configStore";
import { useQuery } from "@tanstack/react-query";

const fetchThreadList = (userId: string, init?: FetchRequestInit) => () =>
	fetcher<Thread[]>(["/threads", userId], init);

export const useThreadListQuery = () => {
	const user = useConfigStore((s) => s.user);
	return useQuery({
		queryKey: [user.id, "threads"],
		queryFn: fetchThreadList(user.id),
	});
};
