import { View } from "react-native";

import type { ToolName } from "@mychat/db/schema/tools";
import { Text } from "@mychat/ui/native/Text";

export function ToolForm({ tool }: { tool: ToolName }) {
	return (
		<View className="flex-1 gap-4 py-4">
			<Text>Tool View {tool}</Text>
		</View>
	);
}
