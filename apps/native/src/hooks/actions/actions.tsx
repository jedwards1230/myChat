import { useQueryClient } from "@tanstack/react-query";

import { fetcher } from "@/lib/fetcher";
import { useUserData } from "../stores/useUserData";
import { useDeleteThreadMutation } from "../fetchers/Thread/useDeleteThreadMutation";
import { useDeleteAllThreadsMutation } from "../fetchers/Thread/useDeleteAllThreadsMutation";

export function useDeleteActiveThread() {
    const { mutateAsync } = useDeleteThreadMutation();
    const action = async (threadId: string) => mutateAsync(threadId);
    return { action };
}

export function useDeleteAllThreads() {
    const { mutateAsync } = useDeleteAllThreadsMutation();
    const action = async () => mutateAsync();
    return { action };
}

/** Reset the Server DB to empty. */
export function useResetDb() {
    const queryClient = useQueryClient();
    const apiKey = useUserData((s) => s.apiKey);

    const action = async () => {
        await fetcher("/reset", { apiKey });
        queryClient.invalidateQueries();
    };

    return { action };
}
