import { useState } from "react";

import type { Agent } from "@mychat/db/schema";
import { api } from "@mychat/api/client/react-query";
import { Section } from "@mychat/ui/native/Section";
import { Text } from "@mychat/ui/native/Text";
import { Textarea } from "@mychat/ui/native/Textarea";

export function SystemMessage({ agent }: { agent: Agent }) {
	const [systemMessage, setSystemMessage] = useState(agent.systemMessage);
	const [editMode, setEditMode] = useState(false);
	const agentEditMut = api.agent.edit.useMutation();

	const handleSubmit = async () => {
		try {
			await agentEditMut.mutateAsync({
				id: agent.id,
				data: {
					//agentConfig: { type: "systemMessage", value: systemMessage },
				},
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
