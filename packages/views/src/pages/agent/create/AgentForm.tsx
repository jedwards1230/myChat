import { useState } from "react";
import { View } from "react-native";

import type { CreateAgent } from "@mychat/db/schema";
import { api } from "@mychat/api/client/react-query";
import { Button } from "@mychat/ui/native/Button";
import { Input } from "@mychat/ui/native/Input";
import { Text } from "@mychat/ui/native/Text";
import { Textarea } from "@mychat/ui/native/Textarea";

const defaultAgent: CreateAgent = {
	name: "",
	systemMessage: "",
	//tools: [],
	toolsEnabled: true,
	model: {} as any,
};

export function AgentForm() {
	const [agent, setAgent] = useState<CreateAgent>(defaultAgent);
	const { mutate } = api.agent.create.useMutation();

	const handleChange = (props: Partial<CreateAgent>) => {
		setAgent((prev) => ({ ...prev, ...props }));
	};

	const onSubmit = async () => {
		if (!agent.name) return console.error("Name is required");
		if (!agent.systemMessage) return console.error("System Message is required");

		mutate(agent);
	};

	return (
		<View className="flex w-full flex-1 gap-2 bg-background p-2">
			<View>
				<Text>Name</Text>
				<Input
					onChangeText={(e) => handleChange({ name: e })}
					value={agent.name}
				/>
			</View>

			<View>
				<Text>System Message</Text>
				<Textarea
					onChangeText={(e) => handleChange({ systemMessage: e })}
					value={agent.systemMessage}
				/>
			</View>

			<Button onPress={onSubmit}>
				<Text>Save</Text>
			</Button>
		</View>
	);
}
