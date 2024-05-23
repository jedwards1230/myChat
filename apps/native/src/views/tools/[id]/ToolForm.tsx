import type { ToolName } from "@/types";
import { View } from "react-native";

import { Text } from "@mychat/ui/native/Text";

export function ToolForm({ tool }: { tool: ToolName }) {
	return (
		<View className="flex-1 gap-4 py-4">
			<Text>Tool View {tool}</Text>
		</View>
	);
}
