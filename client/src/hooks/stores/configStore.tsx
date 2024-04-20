import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Agent, User } from "@/types";
import { createSelectors } from "@/lib/zustand";

type State = {
    threadId: string | null;
    stream: boolean;
    user: User;
    theme: string;
    defaultAgent: Agent;
};

interface Actions {
    setThreadId: (threadId: string | null) => void;
    setStream: (stream: boolean) => void;
    setUser: (user: User) => void;
    setTheme: (theme: string) => void;

    reset: () => void;
}

const initial: State = {
    threadId: null,
    stream: true,
    user: { id: "user-1" } as User,
    theme: "system",
    defaultAgent: {} as Agent,
};

const name = "config";

export const useConfigStore = createSelectors(
    create<State & Actions>()(
        persist(
            (set, get) => ({
                ...initial,
                setThreadId: (threadId) => set({ threadId }),
                setStream: (stream) => set({ stream }),
                setUser: (user) => set({ user }),
                setTheme: (theme) => set({ theme }),

                reset: () => set(initial),
            }),
            {
                name,
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
