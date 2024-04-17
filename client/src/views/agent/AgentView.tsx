import type { Agent } from "@/types";
import { Text } from "@/components/ui/Text";
import { ModelStats, SystemMessage, ToolSection } from "./helpers";

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

const SecondaryInfo = ({ children }: { children: React.ReactNode }) => {
	return <Text className="text-secondary-foreground">{children}</Text>;
};
