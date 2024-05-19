import type { Agent } from "@/types";
import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { Textarea } from "@/components/ui/Textarea";
import { useAgentPatch } from "@/hooks/fetchers/Agent/useAgentPatch";

export function SystemMessage({ agent }: { agent: Agent }) {
	const [systemMessage, setSystemMessage] = useState(agent.systemMessage);
	const [editMode, setEditMode] = useState(false);
	const agentEditMut = useAgentPatch();

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
							className="text-xs text-foreground/50 hover:text-foreground"
						>
							Cancel
						</Text>
						<Text
							onPress={handleSubmit}
							className="text-xs text-foreground/50 hover:text-foreground"
						>
							Save
						</Text>
					</Text>
				) : (
					<Text
						onPress={() => setEditMode(true)}
						className="text-xs text-foreground/50 hover:text-foreground"
					>
						Edit
					</Text>
				)
			}
		>
			{editMode ? (
				<Textarea
					value={systemMessage}
					onChangeText={(s) => setSystemMessage(s)}
					className="max-h-64 overflow-y-scroll border-0"
				/>
			) : (
				<Text className="max-h-64 overflow-y-scroll">{agent.systemMessage}</Text>
			)}
		</Section>
	);
}
