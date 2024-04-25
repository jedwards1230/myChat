import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fetcher } from "@/lib/fetcher";
import { useUserData } from "@/hooks/stores/useUserData";
import { userSessionQueryOptions } from "./useUserQuery";
import { UserSession } from "@/types";

type PostOpts = { email: string; password: string };

const postUserSession = (opts: PostOpts, apiKey: string) =>
    fetcher<UserSession>(`/user/session`, {
        method: "POST",
        apiKey,
        body: JSON.stringify(opts),
    });

export function useUserSessionPost() {
    const { apiKey, session, setSession } = useUserData();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["createUserSession"],
        mutationFn: (opts: PostOpts) => postUserSession(opts, apiKey),
        onSuccess: async (res) => {
            setSession(res);
            if (session)
                await queryClient.invalidateQueries(
                    userSessionQueryOptions(apiKey, session.id)
                );
            await queryClient.invalidateQueries(userSessionQueryOptions(apiKey, res.id));
        },
        onError: (error) => console.error("Failed to create user session: " + error),
    });
}
