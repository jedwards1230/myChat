import { useState } from "react";

import { Agent } from "@/types";
import ModalWrapper from "@/components/ui/Modal";
import { AgentView } from "./AgentView";

export default function AgentModal({
	agent,
	edit = false,
}: {
	agent?: Agent | null;
	edit?: boolean;
}) {
	const [editing, setEditing] = useState(edit);
	const [newAgent, setNewAgent] = useState<Agent | null>(agent || null);

	return (
		<ModalWrapper title={"Agent"}>
			<AgentView agent={newAgent} />
		</ModalWrapper>
	);
}