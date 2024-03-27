import { useState, useEffect } from "react";

import AgentModal from "@/components/views/agent/AgentModal";
import { useConfigStore } from "@/lib/stores/configStore";
import { Agent } from "@/types";

export default function AgentPage() {
	const defaultAgent = useConfigStore(
		(state) => state.user.defaultAgent
	) as unknown as Agent;
	const [agent, setAgent] = useState<Agent | null>(defaultAgent);
	useEffect(() => setAgent(defaultAgent), [defaultAgent]);

	return <AgentModal agent={agent} />;
}

export { ErrorBoundary } from "expo-router";
