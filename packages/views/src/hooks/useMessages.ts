import { useEffect } from "react";
import { useRouter } from "solito/navigation";

import { api } from "@mychat/api/client/react-query";

export function useMessages(threadId: string) {
	console.log("Requested messages for thread", threadId);
	const router = useRouter();
	const { isError, error, ...rest } = api.message.all.useQuery();

	useEffect(() => {
		if (isError) {
			console.warn("Error fetching messages", error);
			router.push("/(app)");
		}
	}, [isError]);

	return { isError, ...rest };
}
