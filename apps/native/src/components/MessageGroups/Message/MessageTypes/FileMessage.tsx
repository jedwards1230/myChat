import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { Link } from "expo-router";
import type { FileData } from "@/components/FileRouter";
import { Icon } from "@/components/ui/Icon";

export const FileMessage = ({ data: { file, query } }: { data: FileData }) => {
	if ("id" in file) {
		return (
			<View className="self-start flex-grow-0 w-auto mb-4">
				<Link asChild href={{ pathname: `/file/${file.id}`, params: query }}>
					<Pressable className="flex items-center gap-1 p-2 border rounded-md bg-secondary">
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
