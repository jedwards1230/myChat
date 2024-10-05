import { useLocalSearchParams } from "expo-router";
import { useAgentQuery } from "@/hooks/fetchers/Agent/useAgentQuery";
import AgentModal from "@/views/agent/AgentModal";

export default function AgentPage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const query = useAgentQuery(id ?? "");
	if (id === undefined || query.isError) {
		console.error(query.error);
		return null;
	}
	if (!query.isSuccess) return null;
	return <AgentModal existingAgent={query.data} />;
}
