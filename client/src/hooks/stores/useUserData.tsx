import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { User, UserSession } from "@/types";
import { createSelectors } from "@/lib/zustand";

type State = {
    user: User | null;
    session: UserSession | null;
    apiKey: string;
};

interface Actions {
    setUser: (user: User | null) => void;
    setSession: (session: UserSession | null) => void;
}

const initial: State = {
    user: null,
    session: null,
    apiKey: "user-1",
};

const name = "userData";

export const useUserData = createSelectors(
    create<State & Actions>()(
        persist(
            (set) => ({
                ...initial,
                setUser: (user) => set({ user }),
                setSession: (session) => set({ session }),
            }),
            { name, storage: createJSONStorage(() => AsyncStorage) }
        )
    )
);
