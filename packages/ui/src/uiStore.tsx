import AsyncStorage from "@react-native-async-storage/async-storage";

import {
	create,
	createJSONStorage,
	createSelectors,
	persist,
} from "@mychat/shared/lib/zustand";

interface State {
	threadId: string | null;
	stream: boolean;
	theme: string;
	debugQuery: boolean;
}

interface Actions {
	setThreadId: (threadId: string | null) => void;
	setStream: (stream: boolean) => void;
	setTheme: (theme: string) => void;
	setDebugQuery: (debugQuery: boolean) => void;

	reset: () => void;
}

const initial: State = {
	threadId: null,
	stream: true,
	theme: "system",
	debugQuery: false,
};

const name = "config";

export const useConfigStore = createSelectors(
	create<State & Actions>()(
		persist(
			(set) => ({
				...initial,
				setThreadId: (threadId) => set({ threadId }),
				setStream: (stream) => set({ stream }),
				setTheme: (theme) => set({ theme }),
				setDebugQuery: (debugQuery) => set({ debugQuery }),

				reset: () => set(initial),
			}),
			{
				name,
				storage: createJSONStorage(() => AsyncStorage),
			},
		),
	),
);
