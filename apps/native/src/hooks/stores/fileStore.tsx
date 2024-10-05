import { create } from "zustand";

import type { FileInformation } from "../useFileInformation";
import { createSelectors } from "@/lib/zustand";

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

export const useFileStore = createSelectors(
    create<State & Actions>()((set, get) => ({
        ...initial,
        addFile: (file) => set({ fileList: [...get().fileList, file] }),
        addFiles: (files) => set({ fileList: [...get().fileList, ...files] }),
        setFiles: (files) => set({ fileList: files }),
        removeFile: (file) => set({ fileList: get().fileList.filter((f) => f !== file) }),
        removeFiles: (files) =>
            set({
                fileList: get().fileList.filter(
                    (f) => !files.some((file) => file.id === f.id)
                ),
            }),
        reset: () => set(initial),
    }))
);
