import { useRef, useState } from "react";

import { useRequestChatMutation } from "@/hooks/fetchers/Runs/useRequestChatMutation";
import { useRequestThreadTitleMutation } from "@/hooks/fetchers/Runs/useRequestThreadTitleMutation";

export const useChatResponse = () => {
    const [loading, setLoading] = useState(false);
    const chatMut = useRequestChatMutation(() => setLoading(false));
    const titleMut = useRequestThreadTitleMutation();
    const abortController = useRef(new AbortController());

    const requestChat = async (threadId: string) => {
        setLoading(true);
        await chatMut.mutateAsync({
            threadId,
            signal: abortController.current.signal,
        });

        chatMut.reset();
        titleMut
            .mutateAsync(threadId)
            .catch(console.error)
            .then(() => titleMut.reset());
    };

    const abort = () => {
        abortController.current.abort();
        abortController.current = new AbortController();
        chatMut.reset();
        titleMut.reset();
        setLoading(false);
    };

    return { requestChat, abort, isResponding: loading };
};
