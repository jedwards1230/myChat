import { create } from "zustand";

import type { Model, ModelInformation } from "@/types";
import { Agent } from "@/types";
import { createSelectors } from "@/lib/zustand";

type State = {
	agent: Agent;
	model: ModelInformation | null;
	stream: boolean;
};

interface Actions {
	setAgent: (agent: Agent) => void;
	setModel: (model: ModelInformation | null) => void;
	setStream: (stream: boolean) => void;
	toggleStream: () => void;

	reset: () => void;
}

const initial: State = {
	agent: {
		id: "default",
		createdAt: new Date(),
		name: "default",
		tools: [],
		toolsEnabled: false,
		systemMessage: "default",
	},
	model: null,
	stream: true,
};

export const useAgentStore = createSelectors(
	create<State & Actions>()((set, get) => ({
		...initial,
		setAgent: (agent) => set({ agent }),
		setModel: (model) => set({ model }),
		setStream: (stream) => set({ stream }),
		toggleStream: () => set((state) => ({ stream: !state.stream })),

		reset: () => set(initial),
	}))
);

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
