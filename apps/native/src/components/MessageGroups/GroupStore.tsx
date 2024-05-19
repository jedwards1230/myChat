import { createSelectors } from "@/lib/zustand";
import { create } from "zustand";

interface State {
	editGroupId: string | null;
	editMessageId: string | null;
	loadingMessageId: string | null;
}

interface Actions {
	setEditId: (s: { editGroupId: string; editMessageId: string }) => void;
	isEditMode: (messageId: string) => boolean;
	setLoading: (messageId: string) => void;
	isLoading: (messageId: string) => boolean;
	reset: () => void;
}

const initial: State = {
	editGroupId: null,
	editMessageId: null,
	loadingMessageId: null,
};

export const useGroupStore = createSelectors(
	create<State & Actions>()((set, get) => ({
		...initial,
		setEditId: (ids) => set(ids),
		isEditMode: (messageId) => get().editMessageId === messageId,
		setLoading: (messageId) => set({ loadingMessageId: messageId }),
		isLoading: (messageId) => get().loadingMessageId === messageId,
		reset: () => set(initial),
	})),
);
