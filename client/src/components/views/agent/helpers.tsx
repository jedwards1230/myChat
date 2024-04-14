import { useState } from "react";
import { View } from "react-native";

import type { Agent, ModelInformation } from "@/types";
import { useModelsQuery } from "@/hooks/queries/useModelsQuery";
import { Text } from "@/components/ui/Text";
import { Switch } from "@/components/ui/Switch";
import { RowItem, Section, SectionBlock } from "@/components/ui/Section";
import {
	Select,
	SelectItem,
	SelectTrigger,
	SelectContent,
	SelectValue,
	Option,
} from "@/components/ui/Select";
import { useAgentStore } from "@/hooks/stores/agentStore";
import { useToolsQuery } from "@/hooks/queries/useAgentQuery";

export function SystemMessage({ agent }: { agent: Agent }) {
	return (
		<Section title="System Message">
			<Text className="overflow-y-scroll max-h-64">{agent?.systemMessage}</Text>
		</Section>
	);
}

export function ToolSection({ agent }: { agent: Agent }) {
	const [checked, setChecked] = useState(false);
	const { data } = useToolsQuery();

	return (
		<Section title="Tools">
			<RowItem>
				<Text>Enabled</Text>
				<Switch
					checked={checked}
					onCheckedChange={setChecked}
					nativeID="airplane-mode"
				/>
			</RowItem>
			{checked &&
				(data && data.length ? (
					data.map((tool) => (
						<RowItem key={tool}>
							<Text>{tool}</Text>
						</RowItem>
					))
				) : (
					<Text className="text-red-500">No tools Found</Text>
				))}
		</Section>
	);
}

const SecondaryInfo = ({ children }: { children: React.ReactNode }) => {
	return <Text className="text-secondary-foreground">{children}</Text>;
};

export function ModelStats({ agent }: { agent: Agent }) {
	return (
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
	);
}

export function ModelSection({
	model,
	container,
}: {
	model: ModelInformation | null;
	container: HTMLElement | null;
}) {
	return (
		<View className="flex w-full gap-2">
			<View className="flex flex-row items-center justify-between px-4 pb-2">
				<Text className="text-secondary-foreground">Model</Text>
			</View>
			<ModelSelector modelInfo={model} container={container} />
			{model && (
				<SectionBlock>
					<RowItem>
						<Text>Model: {model.name || "N/A"}</Text>
					</RowItem>
					<RowItem>
						<Text>Provider: {model.api || "N/A"}</Text>
					</RowItem>
					<RowItem>
						<Text>Token Limit: {model.params?.maxTokens || "N/A"}</Text>
					</RowItem>
					<RowItem>
						<Text>Can Stream: {model.params?.canStream || "N/A"}</Text>
					</RowItem>
				</SectionBlock>
			)}
		</View>
	);
}

function ModelSelector({
	container,
	modelInfo,
}: {
	container: HTMLElement | null;
	modelInfo: ModelInformation | null;
}) {
	const agentStore = useAgentStore();
	const { data, isPending, isError, error } = useModelsQuery();

	const updateModel = (opt: Option) => {
		if (!data || !opt) return console.warn("No data or value");
		const model = data.find((m) => m.name === opt.value);
		if (!model) return console.warn("Model not found");
		agentStore.setModel(model);
	};

	if (isError) {
		console.error(error);
		return <Text className="text-red-500">Failed to load models</Text>;
	}
	if (isPending) return <Text>Loading models...</Text>;
	if (!data.length) return <Text className="text-red-500">No models Found</Text>;
	return (
		<Select
			onValueChange={updateModel}
			value={
				modelInfo ? { value: modelInfo.name, label: modelInfo.name } : undefined
			}
		>
			<SelectTrigger>
				<SelectValue placeholder="Select a model" />
			</SelectTrigger>
			<SelectContent container={container}>
				{data.map((model) => (
					<SelectItem key={model.name} label={model.name} value={model.name}>
						Model: {model.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
