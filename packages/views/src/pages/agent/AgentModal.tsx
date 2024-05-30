import { api } from "@mychat/api/client/react-query";
import ModalWrapper from "@mychat/ui/native/Modal";
import Toast from "@mychat/ui/providers/ToastProvider";

import { AgentView } from "./AgentView";

export default function AgentModal({ agentId }: { agentId: string }) {
	const agentQuery = api.agent.byId.useQuery({ id: agentId });

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
