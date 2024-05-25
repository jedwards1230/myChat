import { useConfigStore } from "@/hooks/stores/configStore";

import AgentModal from "@mychat/ui/views/agent/AgentModal";

export default function AgentPage() {
	const defaultAgent = useConfigStore.use.defaultAgent();
	return <AgentModal existingAgent={defaultAgent} />;
}

export { ErrorBoundary } from "expo-router";
