import type { Agent } from "@mychat/db/schema";
import { api } from "@mychat/api/client/react-query";

import type { Option } from "~/native/Select";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/native/Select";
import { Text } from "~/native/Text";

export function ModelSelector({
	container,
	agent: { id, model },
}: {
	container: HTMLElement | null;
	agent: Agent;
}) {
	const { data, isPending, isError, error } = api.agent.models.useQuery();
	const agentEditMut = api.agent.edit.useMutation();

	const updateModel = async (opt: Option) => {
		if (!data || !opt) return console.warn("No data or value");
		const model = data.find((m) => m.name === opt.value);
		if (!model) return console.warn("Model not found");
		await agentEditMut.mutateAsync({
			id,
			data: {
				//agentConfig: { type: "model", value: model },
			},
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
