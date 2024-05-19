import type { AgentCreateSchema } from "@/types";
import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { Textarea } from "@/components/ui/Textarea";
import { useAgentPost } from "@/hooks/fetchers/Agent/useAgentPost";

const defaultAgent: AgentCreateSchema = {
	name: "",
	systemMessage: "",
	tools: [],
	toolsEnabled: true,
	model: {} as any,
};

export function AgentForm() {
	const [agent, setAgent] = useState<AgentCreateSchema>(defaultAgent);
	const { mutate } = useAgentPost();

	const handleChange = (props: Partial<AgentCreateSchema>) => {
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
