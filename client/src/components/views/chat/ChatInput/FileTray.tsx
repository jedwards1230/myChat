import { View } from "react-native";

import { useFileStore } from "@/lib/stores/fileStore";
import { FileButton } from "./FileButton";

export function FileTray() {
	const fileList = useFileStore((state) => state.fileList);

	if (!fileList.length) return null;
	return (
		<View className="flex flex-row justify-start w-full gap-4 pt-2">
			{fileList.map((file, index) => (
				<FileButton key={index} file={file} />
			))}
		</View>
	);
}
