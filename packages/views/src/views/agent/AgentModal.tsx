import Toast from "react-native-toast-message";

import type { Agent } from "@mychat/db/schema";
import { api } from "@mychat/api/client/react-query";
import ModalWrapper from "@mychat/ui/native/Modal";

import { AgentView } from "./AgentView";

export default function AgentModal({ existingAgent }: { existingAgent: Agent }) {
	const agentQuery = api.agent.byId.useQuery({ id: existingAgent.id });

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
