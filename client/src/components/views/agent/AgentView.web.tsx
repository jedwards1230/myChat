import { View } from "react-native";

import type { Agent } from "@/types";
import { Text } from "@/components/ui/Text";

export function AgentView({ agent }: { agent: Agent }) {
	return (
		<View className="w-full p-2">
			<Text className="overflow-y-scroll !border max-h-32 !border-input">
				{agent?.systemMessage}
			</Text>

			<View>
				<View>
					<Text className="font-semibold">Tools</Text>
				</View>
				<View className="py-2 pl-4">
					{agent && agent.tools.length > 0 ? (
						agent.tools.map((tool) => (
							<View key={tool}>
								<Text>{tool}</Text>
							</View>
						))
					) : (
						<Text>"N/A"</Text>
					)}
				</View>
			</View>

			<View className="flex flex-col w-full gap-2">
				<SecondaryInfo>
					{agent?.threads?.length || "N/A"} Active Threads
				</SecondaryInfo>
				<SecondaryInfo>Owner: {agent?.owner || "N/A"}</SecondaryInfo>
				<SecondaryInfo>ID: {agent?.id || "N/A"}</SecondaryInfo>
			</View>
		</View>
	);
}

const SecondaryInfo = ({ children }: { children: React.ReactNode }) => {
	return <Text className="text-secondary-foreground">{children}</Text>;
};
