import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { User } from "@/types";

type State = {
	threadId: string | null;
	host: string;
	stream: boolean;
	user: User;
	theme: string;
};

interface Actions {
	setThreadId: (threadId: string | null) => void;
	setHost: (host: string) => void;
	setStream: (stream: boolean) => void;
	setUser: (user: User) => void;
	setTheme: (theme: string) => void;

	reset: () => void;
}

const initial: State = {
	threadId: null,
	host: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
	stream: true,
	user: { id: "user-1" } as User,
	theme: "system",
};

const name = "config";

export const useConfigStore = create<State & Actions>()(
	persist(
		(set, get) => ({
			...initial,
			setThreadId: (threadId) => set({ threadId }),
			setHost: (host) => set({ host }),
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
);
