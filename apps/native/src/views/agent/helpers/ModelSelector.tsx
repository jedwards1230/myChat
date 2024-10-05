import type { Option } from "@/components/ui/Select";
import type { Agent } from "@/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { Text } from "@/components/ui/Text";
import { useAgentPatch } from "@/hooks/fetchers/Agent/useAgentPatch";
import { useModelsQuery } from "@/hooks/fetchers/useModelsQuery";

export function ModelSelector({
	container,
	agent: { id, model },
}: {
	container: HTMLElement | null;
	agent: Agent;
}) {
	const agentEditMut = useAgentPatch();
	const { data, isPending, isError, error } = useModelsQuery();

	const updateModel = async (opt: Option) => {
		if (!data || !opt) return console.warn("No data or value");
		const model = data.find((m) => m.name === opt.value);
		if (!model) return console.warn("Model not found");
		await agentEditMut.mutateAsync({
			agentId: id,
			agentConfig: { type: "model", value: model },
		});
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
			value={{ value: model.name, label: model.name }}
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
