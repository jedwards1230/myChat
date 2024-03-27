import { Switch, View } from "react-native";

import { Agent } from "@/types";

import { Section, RowItem } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { Textarea } from "@/components/ui/Textarea";

export function AgentView({ agent }: { agent?: Agent | null }) {
	return (
		<>
			<Section title="System Message">
				<Textarea
					className="max-h-64 text-foreground"
					value={agent?.systemMessage}
				/>
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

			<View className="flex flex-col w-full gap-2 px-4 mx-auto text-center">
				<SecondaryInfo>
					{agent?.threads?.length || "N/A"} Active Threads
				</SecondaryInfo>
				<SecondaryInfo>Owner: {agent?.owner?.id || "N/A"}</SecondaryInfo>
				<SecondaryInfo>ID: {agent?.id || "N/A"}</SecondaryInfo>
			</View>
		</>
	);
}

const SecondaryInfo = ({ children }: { children: React.ReactNode }) => {
	return <Text className="text-secondary-foreground">{children}</Text>;
};
