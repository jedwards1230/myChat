import type { InferResultType } from "@mychat/db/types";

import { ModelSection, ModelStats, ToolSection } from "./helpers";
import { SystemMessage } from "./helpers/SystemMessage";

type Agent = InferResultType<"Agent", { owner: true; threads: true; tools: true }>;

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
			<ModelSection agent={agent} container={null} />
		</>
	);
}
