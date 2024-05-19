import type { User } from "@/types";
import { useUserData } from "@/hooks/stores/useUserData";
import { fetcher } from "@/lib/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userSessionQueryOptions } from "./useUserQuery";

interface PostOpts {
	email: string;
	password: string;
}

const postUser = (opts: PostOpts, apiKey: string) =>
	fetcher<User>(`/user`, {
		method: "POST",
		apiKey,
		body: JSON.stringify(opts),
	});

export function useUserPost() {
	const { apiKey, session } = useUserData();
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ["createUser"],
		mutationFn: (opts: PostOpts) => postUser(opts, apiKey),
		onSuccess: () =>
			session &&
			queryClient.refetchQueries(userSessionQueryOptions(apiKey, session.id)),
		onError: (error) => console.error("Failed to create user: " + error.message),
	});
}
