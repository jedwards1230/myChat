import type { Agent } from "@/types";
import { ModelStats, ToolSection } from "./helpers";
import { SystemMessage } from "./SystemMessage";

export function AgentView({ agent }: { agent?: Agent | null }) {
	if (!agent) {
		console.warn("No agent provided to AgentView");
		return null;
	}
	return (
		<>
			<SystemMessage agent={agent} />
			<ToolSection agent={agent} />
			<ModelStats agent={agent} />
		</>
	);
}
