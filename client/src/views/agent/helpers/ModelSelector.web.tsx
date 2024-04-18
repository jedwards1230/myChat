import { useModelsQuery } from "@/hooks/fetchers/useModelsQuery";
import { useAgentStore } from "@/hooks/stores/agentStore";
import {
	Select,
	SelectItem,
	SelectTrigger,
	SelectContent,
	SelectValue,
	Option,
} from "@/components/ui/Select";
import { ModelInformation } from "@/types";
import { Text } from "@/components/ui/Text";

export function ModelSelector({
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
