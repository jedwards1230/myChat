import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { UserSessionSchema } from "../../schemas/Session";
import type { UserSchema } from "../../schemas/User";
import { createSelectors } from "../../lib/zustand";

interface State {
	user: UserSchema | null;
	session: UserSessionSchema | null;
	apiKey: string;
}

interface Actions {
	setUser: (user: UserSchema | null) => void;
	setSession: (session: UserSessionSchema | null) => void;
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
			{ name, storage: createJSONStorage(() => AsyncStorage) },
		),
	),
);
