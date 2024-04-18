import { create } from "zustand";

import type { ModelInformation } from "@/types";
import { createSelectors } from "@/lib/zustand";

type State = { model: ModelInformation | null };

interface Actions {
	setModel: (model: ModelInformation | null) => void;
}

const initial: State = { model: null };

export const useAgentStore = createSelectors(
	create<State & Actions>()((set, get) => ({
		...initial,
		setModel: (model) => set({ model }),
	}))
);
