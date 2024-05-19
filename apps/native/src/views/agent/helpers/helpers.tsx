import type { Agent } from "@/types";
import { View } from "react-native";
import { RowItem, Section, SectionBlock } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";

import { ModelSelector } from "./ModelSelector.web";

const SecondaryInfo = ({ children }: { children: React.ReactNode }) => {
	return <Text className="text-secondary-foreground">{children}</Text>;
};

export function ModelStats({ agent }: { agent: Agent }) {
	return (
		<Section title="Stats">
			<RowItem>
				<SecondaryInfo>
					Active Threads: {agent.threads?.length ?? "N/A"}
				</SecondaryInfo>
			</RowItem>
			<RowItem>
				<SecondaryInfo>Owner: {agent.owner ?? "N/A"}</SecondaryInfo>
			</RowItem>
			<RowItem>
				<SecondaryInfo>ID: {agent.id || "N/A"}</SecondaryInfo>
			</RowItem>
		</Section>
	);
}

export function ModelSection({
	agent,
	container,
}: {
	agent: Agent;
	container: HTMLElement | null;
}) {
	const { model } = agent;
	return (
		<View className="flex w-full gap-2">
			<View className="flex flex-row items-center justify-between px-4 pb-2">
				<Text className="text-secondary-foreground">Model</Text>
			</View>
			<ModelSelector agent={agent} container={container} />
			<SectionBlock>
				<RowItem>
					<Text>Model: {model.name}</Text>
				</RowItem>
				<RowItem>
					<Text>Provider: {model.api}</Text>
				</RowItem>
				<RowItem>
					<Text>Token Limit: {model.params.maxTokens || "N/A"}</Text>
				</RowItem>
				<RowItem>
					<Text>
						Can Stream:{" "}
						{"canStream" in model.params ? model.params.canStream : "N/A"}
					</Text>
				</RowItem>
			</SectionBlock>
		</View>
	);
}
