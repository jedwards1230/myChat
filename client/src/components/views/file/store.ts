import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

type State = {
	downloadProgress: number;
	pausedDownload: string;
};

interface Actions {
	setDownloadProgress: (progress: FileSystem.DownloadProgressData) => void;
	setPausedDownload: (pausedDownload: string) => void;
	reset: () => void;
}

const initial: State = {
	downloadProgress: 0,
	pausedDownload: "",
};

const name = "fileSystem";

export const useFileSystemStore = create<State & Actions>()(
	persist(
		(set, get) => ({
			...initial,
			setDownloadProgress: (progress) => {
				const progressValue =
					progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
				set({ downloadProgress: progressValue });
			},
			setPausedDownload: (pausedDownload) => set({ pausedDownload }),

			reset: () => set(initial),
		}),
		{
			name,
			storage: createJSONStorage(() => AsyncStorage),
		}
	)
);
