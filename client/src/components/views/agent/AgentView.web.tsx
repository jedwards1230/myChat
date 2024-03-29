import { Switch, View } from "react-native";

import type { Agent } from "@/types";
import { Text } from "@/components/ui/Text";
import { RowItem, Section } from "@/components/ui/Section";
import { Textarea } from "@/components/ui/Textarea";

export function AgentView({ agent }: { agent: Agent }) {
	return (
		<View className="w-full p-2">
			<Section title="System Message">
				<Text>{agent?.systemMessage}</Text>
				{/* <Textarea
					className="max-h-64 text-foreground"
					value={agent?.systemMessage}
				/> */}
			</Section>

			<Section title="Tools">
				<RowItem>
					<Text>Enabled</Text>
					<Switch style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }} />
				</RowItem>
				{agent?.tools?.map((tool) => (
					<RowItem key={tool}>
						<Text>{tool}</Text>
					</RowItem>
				))}
			</Section>

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
