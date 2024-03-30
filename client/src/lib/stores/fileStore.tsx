import { create } from "zustand";
import type { DocumentPickerAsset } from "expo-document-picker";

import type { CacheFile } from "@/types";

type State = {
	fileList: CacheFile[];
};

interface Actions {
	addFile: (file: CacheFile) => void;
	addFiles: (files: CacheFile[]) => void;
	setFiles: (files: CacheFile[]) => void;
	addAsset: (asset: DocumentPickerAsset) => void;
	addAssets: (assets: DocumentPickerAsset[]) => void;
	removeFile: (file: CacheFile) => void;
	removeFiles: (files: CacheFile[]) => void;

	reset: () => void;
}

const initial: State = {
	fileList: [],
};

export const useFileStore = create<State & Actions>()((set, get) => ({
	...initial,
	addFile: (file) => set({ fileList: [...get().fileList, file] }),
	addFiles: (files) => set({ fileList: [...get().fileList, ...files] }),
	setFiles: (files) => set({ fileList: files }),
	addAsset: (asset) => set({ fileList: [...get().fileList, asset] }),
	addAssets: (assets) => set({ fileList: [...get().fileList, ...assets] }),

	removeFile: (file) => set({ fileList: get().fileList.filter((f) => f !== file) }),
	removeFiles: (files) =>
		set({ fileList: get().fileList.filter((f) => !files.includes(f)) }),

	reset: () => set(initial),
}));
