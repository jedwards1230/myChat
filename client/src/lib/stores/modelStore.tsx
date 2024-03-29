import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Model, ModelApi } from "@/lib/models/types";
import { modelMap } from "@/lib/models/models";
import { Agent } from "@/types";

type State = {
	agent: Agent;
	model: ModelApi;
	stream: boolean;
};

interface Actions {
	setAgent: (agent: Agent) => void;
	setModel: (model: Model) => void;
	setStream: (stream: boolean) => void;
	toggleStream: () => void;

	reset: () => void;
}

const initial: State = {
	agent: {
		id: "default",
		createdAt: new Date().toLocaleDateString(),
		name: "default",
		tools: [],
		toolsEnabled: false,
		systemMessage: "default",
	},
	model: modelMap["gpt-4-turbo"],
	stream: true,
};

export const useAgentStore = create<State & Actions>()((set, get) => ({
	...initial,
	setAgent: (agent) => set({ agent }),
	setModel: (model) => set({ model: modelMap[model] }),
	setStream: (stream) => set({ stream }),
	toggleStream: () => set((state) => ({ stream: !state.stream })),

	reset: () => set(initial),
}));

const name = "agent";

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
