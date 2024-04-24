import AgentModal from "@/views/agent/AgentModal";
import { useConfigStore } from "@/hooks/stores/configStore";

export default function AgentPage() {
	const defaultAgent = useConfigStore.use.defaultAgent();
	return <AgentModal existingAgent={defaultAgent} />;
}

export { ErrorBoundary } from "expo-router";
