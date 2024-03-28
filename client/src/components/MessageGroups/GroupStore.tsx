import { create } from "zustand";

type State = {
	editGroupId: string | null;
	editMessageId: string | null;
};

interface Actions {
	setEditId: (s: { editGroupId: string; editMessageId: string }) => void;
	reset: () => void;
}

const initial: State = {
	editGroupId: null,
	editMessageId: null,
};

export const useGroupStore = create<State & Actions>()((set, get) => ({
	...initial,
	setEditId: (ids) => set(ids),
	reset: () => set(initial),
}));
