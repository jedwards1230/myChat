import { useLocalSearchParams } from "expo-router";

import AgentModal from "@/components/views/agent/AgentModal";
import { useAgentQuery } from "@/hooks/queries/useAgentQuery";

export default function AgentPage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const query = useAgentQuery(id);
	if (query.isError) {
		console.log(query.error);
		return null;
	}
	if (!query.isSuccess) return null;
	return <AgentModal agent={query.data} />;
}
