import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { User, UserSession } from "@/types";
import { fetcher } from "@/lib/fetcher";
import { createSelectors } from "@/lib/zustand";

const createUser = async (email: string, password: string) =>
	fetcher<User>("/user", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});

const loginUser = async (email: string, password: string) =>
	fetcher<UserSession>("/user/session", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});

const logoutUser = async (sessionId: string) =>
	fetcher(`/user/session/${sessionId}`, { method: "DELETE" });

type State = {
	user: User | null;
	session: UserSession | null;
	apiKey: string;
	theme: string;
};

interface Actions {
	setUser: (user: User | null) => void;
	setSession: (session: UserSession | null) => void;
	setTheme: (theme: string) => void;
	login: (email: string, password: string) => Promise<void>;
	signup: (email: string, password: string) => Promise<void>;
	logout: () => void;
	reset: () => void;
}

const initial: State = {
	user: null,
	session: null,
	apiKey: "user-1",
	theme: "system",
};

const name = "userData";

export const useUserData = createSelectors(
	create<State & Actions>()(
		persist(
			(set, get) => ({
				...initial,
				setUser: (user) => set({ user }),
				setSession: (session) => set({ session }),
				setTheme: (theme) => set({ theme }),
				login: async (email, password) => {
					const session = await loginUser(email, password);
					set({ session });
				},
				signup: async (email, password) => {
					await createUser(email, password);
					const session = await loginUser(email, password);
					set({ session });
				},
				logout: async () => {
					const id = get().session?.id;
					if (!id) return console.error("No active session");
					await logoutUser(id);
					set({ session: null });
				},
				reset: () => set(initial),
			}),
			{
				name,
				storage: createJSONStorage(() => AsyncStorage),
			}
		)
	)
);
