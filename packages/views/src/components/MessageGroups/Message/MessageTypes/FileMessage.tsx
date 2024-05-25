import { Pressable, View } from "react-native";
import { Link } from "expo-router";

import { Icon } from "@mychat/ui/native/Icon";
import { Text } from "@mychat/ui/native/Text";

import type { FileData } from "~/FileRouter";

export const FileMessage = ({ data: { file, query } }: { data: FileData }) => {
	if ("id" in file) {
		return (
			<View className="mb-4 w-auto flex-grow-0 self-start">
				<Link
					asChild
					href={{
						pathname: `/file/${file.id}`,
						params: {
							threadId: query?.threadId,
							messageId: query?.messageId,
							fileId: file.id,
						},
					}}
				>
					<Pressable className="flex items-center gap-1 rounded-md border bg-secondary p-2">
						<Icon type="Ionicons" name="attach" />
						<Text>{file.name}</Text>
					</Pressable>
				</Link>
			</View>
		);
	}

	console.error("FileMessage - File ID is required");
	return null;
};
