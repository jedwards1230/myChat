import { Switch, View } from "react-native";

import type { Agent } from "@/types";
import { Text } from "@/components/ui/Text";
import { RowItem, Section } from "@/components/ui/Section";

export function AgentView({ agent }: { agent: Agent }) {
	const model = {
		name: "gpt-4-0125-preview",
		provider: "OpenAI",
		tokenLimit: 128000,
		canStream: true,
		canUseTools: true,
	};
	return (
		<View className="flex w-full gap-4 p-2">
			<Section title="System Message">
				<Text className="overflow-y-scroll max-h-64">{agent?.systemMessage}</Text>
			</Section>

			<Section title="Tools">
				<RowItem>
					<Text>Enabled</Text>
					<Switch style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }} />
				</RowItem>
				{agent && agent.tools.length > 0 ? (
					agent.tools.map((tool) => (
						<RowItem key={tool}>
							<Text>{tool}</Text>
						</RowItem>
					))
				) : (
					<RowItem>
						<Text>"N/A"</Text>
					</RowItem>
				)}
			</Section>

			<Section title="Model">
				<RowItem>
					<Text>Model: {model.name || "N/A"}</Text>
				</RowItem>
				<RowItem>
					<Text>Provider: {model.provider || "N/A"}</Text>
				</RowItem>
				<RowItem>
					<Text>Token Limit: {model.tokenLimit || "N/A"}</Text>
				</RowItem>
				<RowItem>
					<Text>Can Stream: {model.canStream || "N/A"}</Text>
				</RowItem>
			</Section>

			<Section title="Stats">
				<RowItem>
					<SecondaryInfo>
						Active Threads: {agent?.threads?.length || "N/A"}
					</SecondaryInfo>
				</RowItem>
				<RowItem>
					<SecondaryInfo>Owner: {agent?.owner || "N/A"}</SecondaryInfo>
				</RowItem>
				<RowItem>
					<SecondaryInfo>ID: {agent?.id || "N/A"}</SecondaryInfo>
				</RowItem>
			</Section>
		</View>
	);
}

const SecondaryInfo = ({ children }: { children: React.ReactNode }) => {
	return <Text className="text-secondary-foreground">{children}</Text>;
};
