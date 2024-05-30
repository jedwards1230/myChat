import { useLocalSearchParams } from "expo-router";
import { skipToken } from "@tanstack/react-query";

import { api } from "@mychat/api/client/react-query";
import AgentModal from "@mychat/views/pages/agent/AgentModal";

export default function AgentPage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const query = api.agent.byId.useQuery(id ? { id } : skipToken);
	if (id === undefined || query.isError) {
		console.error(query.error);
		return null;
	}
	if (!query.isSuccess) return null;
	return <AgentModal agentId={query.data?.id ?? ""} />;
}
