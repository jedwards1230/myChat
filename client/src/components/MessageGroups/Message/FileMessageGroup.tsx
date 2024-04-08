import { View } from "react-native";

import { FileRouter } from "@/components/FileRouter";
import { useFilesInformation } from "@/hooks/useFileInformation";
import { FileMessage } from "./MessageTypes/FileMessage";

export function FileMessageGroup(query: { messageId: string; threadId: string }) {
	const files = useFilesInformation(query);
	return (
		<View className="flex flex-row flex-wrap gap-x-2 gap-y-1">
			<FileRouter
				data={{ files, query }}
				routerComponents={{ FileButton: FileMessage }}
			/>
		</View>
	);
}
