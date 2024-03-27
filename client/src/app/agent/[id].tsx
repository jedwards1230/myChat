import { useLocalSearchParams } from "expo-router";

import AgentModal from "@/components/views/agent/AgentModal";
import { useAgentQuery } from "@/lib/queries/useAgentQuery";

export default function AgentPage() {
	const { id } = useLocalSearchParams();
	if (Array.isArray(id)) {
		throw new Error("Invalid agent id");
	}
	const query = useAgentQuery(id);

	if (!query.data) {
		console.log(query.error);
		return null;
	}
	return <AgentModal agent={query.data} />;
}
