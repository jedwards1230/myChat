import Toast from "react-native-toast-message";

import type { Agent } from "@mychat/db/schema";
import { api } from "@mychat/api/client/react-query";

import { Switch } from "~/native/Switch";

export function ToggleToolsSwitch({ agent }: { agent: Agent }) {
	const agentEditMut = api.agent.edit.useMutation();

	const onCheckedChange = async (checked: boolean) => {
		try {
			console.log("checked", checked);
			await agentEditMut.mutateAsync({
				id: agent.id,
				data: {
					//agentConfig: { type: "toolsEnabled", value: checked },
				},
			});
		} catch (error: any) {
			console.error(error);
			Toast.show({
				type: "error",
				text1: "Error",
				text2: "message" in error ? error.message : "An error occurred",
			});
		}
	};

	return (
		<Switch
			className="scale-[0.7]"
			checked={agent.toolsEnabled}
			onCheckedChange={onCheckedChange}
		/>
	);
}
