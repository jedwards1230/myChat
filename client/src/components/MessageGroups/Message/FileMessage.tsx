import { Pressable, View } from "react-native";

import type { MessageFile } from "@/types";
import { Text } from "@/components/ui/Text";
import { Link } from "expo-router";

export const FileMessage = ({
	file,
	threadId,
	messageId,
}: {
	file: MessageFile;
	threadId: string;
	messageId: string;
}) => {
	return (
		<View className="self-start flex-grow-0 w-auto mb-4">
			<Link
				asChild
				href={{
					pathname: `/file/${file.id}`,
					params: { messageId, threadId },
				}}
			>
				<Pressable className="p-2 border rounded-md bg-secondary">
					<Text>{file.name}</Text>
				</Pressable>
			</Link>
		</View>
	);
};
