import type { Agent } from "@/types";
import Toast from "react-native-toast-message";
import { useAgentPatch } from "@/hooks/fetchers/Agent/useAgentPatch";

import { Switch } from "@mychat/ui/native/Switch";

export function ToggleToolsSwitch({ agent }: { agent: Agent }) {
	const agentEditMut = useAgentPatch();

	const onCheckedChange = async (checked: boolean) => {
		try {
			await agentEditMut.mutateAsync({
				agentId: agent.id,
				agentConfig: { type: "toolsEnabled", value: checked },
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
