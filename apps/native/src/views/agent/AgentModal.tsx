import type { Agent } from "@/types";
import Toast from "react-native-toast-message";
import { useAgentQuery } from "@/hooks/fetchers/Agent/useAgentQuery";

import ModalWrapper from "@mychat/ui/native/Modal";

import { AgentView } from "./AgentView";

export default function AgentModal({ existingAgent }: { existingAgent: Agent }) {
	const agentQuery = useAgentQuery(existingAgent.id);

	if (agentQuery.isPending) return null;
	if (agentQuery.isError) {
		console.error(agentQuery.error);
		Toast.show({
			type: "error",
			text1: "Error fetching agent",
			text2: agentQuery.error.message,
		});
		return null;
	}

	return (
		<ModalWrapper title={"Agent"}>
			<AgentView agent={agentQuery.data} />
		</ModalWrapper>
	);
}
