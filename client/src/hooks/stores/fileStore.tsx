import { create } from "zustand";
import type { DocumentPickerAsset } from "expo-document-picker";

import { FileInformation, parseLocalFile, parseLocalFiles } from "../useFileInformation";

type State = { fileList: FileInformation[] };

interface Actions {
	addFile: (file: FileInformation) => void;
	addFiles: (files: FileInformation[]) => void;
	setFiles: (files: FileInformation[]) => void;
	removeFile: (file: FileInformation) => void;
	removeFiles: (files: FileInformation[]) => void;

	reset: () => void;
}

const initial: State = { fileList: [] };

export const useFileStore = create<State & Actions>()((set, get) => ({
	...initial,
	addFile: (file) => set({ fileList: [...get().fileList, file] }),
	addFiles: (files) => set({ fileList: [...get().fileList, ...files] }),
	setFiles: (files) => set({ fileList: files }),
	removeFile: (file) => set({ fileList: get().fileList.filter((f) => f !== file) }),
	removeFiles: (files) =>
		set({ fileList: get().fileList.filter((f) => !files.includes(f)) }),

	reset: () => set(initial),
}));
