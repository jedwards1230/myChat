import { useUserData } from "@mychat/views/hooks/useUserData";
import AgentModal from "@mychat/views/pages/agent/AgentModal";

export default function AgentPage() {
	const user = useUserData.use.user();
	return <AgentModal agentId={user?.defaultAgentId ?? ""} />;
}

export { ErrorBoundary } from "expo-router";
