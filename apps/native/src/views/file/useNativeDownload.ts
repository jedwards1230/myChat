import * as FileSystem from "expo-file-system";
import { useFileSystemStore } from "./store";
import { BASE_HOST } from "@/lib/fetcher";

export function useNativeDownload() {
	const { downloadProgress, pausedDownload, setDownloadProgress, setPausedDownload } =
		useFileSystemStore();

	//const url = BASE_HOST + `/threads/${threadId}/messages/${messageId}/files/${fileId}`

	const downloadResumable = FileSystem.createDownloadResumable(
		BASE_HOST,
		FileSystem.documentDirectory + "small.mp4",
		{},
		setDownloadProgress
	);

	const download = async () => {
		try {
			const res = await downloadResumable.downloadAsync();
			if (!res) throw new Error("Download failed");
			return res;
		} catch (e) {
			console.error(e);
			throw e;
		}
	};

	const pause = async () => {
		try {
			const pausedState = await downloadResumable.pauseAsync();
			console.log("Paused download operation, saving for future retrieval");
			setPausedDownload(JSON.stringify(pausedState));
		} catch (e) {
			console.error(e);
		}
	};

	const resume = async () => {
		try {
			const downloadResult = await downloadResumable.resumeAsync();
			if (!downloadResult) throw new Error("Download failed");
			console.log("Finished downloading to ", downloadResult.uri);
		} catch (e) {
			console.error(e);
		}
	};

	const resumeFromSnapshot = async () => {
		const downloadSnapshot = JSON.parse(pausedDownload);
		const downloadResumable = new FileSystem.DownloadResumable(
			downloadSnapshot.url,
			downloadSnapshot.fileUri,
			downloadSnapshot.options,
			setDownloadProgress,
			downloadSnapshot.resumeData
		);

		try {
			const downloadResult = await downloadResumable.resumeAsync();
			if (!downloadResult) throw new Error("Download failed");
			console.log("Finished downloading to ", downloadResult.uri);
		} catch (e) {
			console.error(e);
		}
	};

	return {
		downloadProgress,
		pausedDownload,
		download,
		pause,
		resume,
		resumeFromSnapshot,
	};
}
