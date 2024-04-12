import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { UserData } from "@/types";
import type { Models } from "appwrite";

type State = {
	user: UserData | null;
	session: Models.Session | null;
	apiKey: string;
	theme: string;
};

interface Actions {
	setUser: (user: UserData | null) => void;
	setSession: (session: Models.Session | null) => void;
	setTheme: (theme: string) => void;
	reset: () => void;
}

const initial: State = {
	user: null,
	session: null,
	apiKey: "user-1",
	theme: "system",
};

const name = "userData";

export const useUserData = create<State & Actions>()(
	persist(
		(set, get) => ({
			...initial,
			setUser: (user) => set({ user }),
			setSession: (session) => set({ session }),
			setTheme: (theme) => set({ theme }),
			reset: () => set(initial),
		}),
		{
			name,
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);
