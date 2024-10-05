import { createSelectors } from "@/lib/zustand";
import { create } from "zustand";

type State = { isOpen: boolean };

type Action = { toggleDialog: () => void; setOpen: (isOpen: boolean) => void };

const initialState: State = {
	isOpen: false,
};

export const useCmdDialog = createSelectors(
	create<State & Action>()((set) => ({
		...initialState,
		toggleDialog: () => set((s) => ({ isOpen: !s.isOpen })),
		setOpen: (isOpen) => set({ isOpen }),
	})),
);
