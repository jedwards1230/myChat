import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Model, ModelApi } from "@/lib/models/types";
import { modelMap } from "@/lib/models/models";

type State = {
	model: ModelApi;
	stream: boolean;
};

interface Actions {
	setModel: (model: Model) => void;
	toggleStream: () => void;

	reset: () => void;
}

const initial: State = {
	model: modelMap["gpt-4-turbo"],
	stream: true,
};

export const useModelStore = create<State & Actions>()((set, get) => ({
	...initial,
	setModel: (model) => set({ model: modelMap[model] }),
	toggleStream: () => set((state) => ({ stream: !state.stream })),

	reset: () => set(initial),
}));

const name = "model";

/* export const useModelStore = create<State & Actions>()(
	persist(
		(set, get) => ({
            ...
		}),
		{
			name,
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
); */
