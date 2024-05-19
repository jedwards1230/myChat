import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userSessionQueryOptions } from "./useUserQuery";

const deleteUserSession = (sessionId: string, apiKey: string) =>
	fetcher(`/user/session/${sessionId}`, {
		method: "DELETE",
		apiKey,
	});

export function useUserSessionDelete() {
	const { apiKey, session } = useUserData();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["deleteUserSession"],
		mutationFn: () =>
			session ? deleteUserSession(session.id, apiKey) : Promise.reject(),
		onSuccess: () =>
			session &&
			queryClient.refetchQueries(userSessionQueryOptions(apiKey, session.id)),
		onError: (error) => console.error("Failed to delete message: " + error.message),
	});
}
