import { View } from "react-native";

import ModalWrapper from "@/components/ui/Modal";
import { Text } from "@/components/ui/Text";
import { useAgentsQuery } from "@/hooks/fetchers/Agent/useAgentsQuery";

export default function AgentListModal() {
	const { data: agents, isSuccess } = useAgentsQuery();

	if (!isSuccess) return null;
	return (
		<ModalWrapper title={"Agents"}>
			{agents.length > 0 ? (
				agents.map((agent) => (
					<View key={agent.id}>
						<Text>Agent</Text>
					</View>
				))
			) : (
				<Text>No agents found</Text>
			)}
		</ModalWrapper>
	);
}
