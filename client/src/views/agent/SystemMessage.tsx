import { useState } from "react";

import { Section } from "@/components/ui/Section";
import { Textarea } from "@/components/ui/Textarea";
import { Text } from "@/components/ui/Text";
import { useAgentEditMutation } from "@/hooks/fetchers/Agent/useAgentEditMutation";
import { Agent } from "@/types";

export function SystemMessage({ agent }: { agent: Agent }) {
	const [systemMessage, setSystemMessage] = useState(agent?.systemMessage);
	const [editMode, setEditMode] = useState(false);
	const agentEditMut = useAgentEditMutation();

	const handleSubmit = async () => {
		try {
			await agentEditMut.mutateAsync({
				agentId: agent.id,
				agentConfig: { type: "systemMessage", value: systemMessage },
			});
			setEditMode(false);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Section
			title="System Message"
			titleComponent={
				editMode ? (
					<Text className="flex flex-row items-center gap-2">
						<Text
							onPress={() => setEditMode(false)}
							className="text-xs hover:text-foreground text-foreground/50"
						>
							Cancel
						</Text>
						<Text
							onPress={handleSubmit}
							className="text-xs hover:text-foreground text-foreground/50"
						>
							Save
						</Text>
					</Text>
				) : (
					<Text onPress={() => setEditMode(true)} className="text-xs">
						Edit
					</Text>
				)
			}
		>
			{editMode ? (
				<Textarea
					value={systemMessage}
					onChangeText={(s) => setSystemMessage(s)}
					className="overflow-y-scroll border-0 max-h-64"
				/>
			) : (
				<Text className="overflow-y-scroll max-h-64">{agent?.systemMessage}</Text>
			)}
		</Section>
	);
}
