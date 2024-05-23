import { View } from "react-native";
import { useAgentsQuery } from "@/hooks/fetchers/Agent/useAgentsQuery";

import ModalWrapper from "@mychat/ui/native/Modal";
import { Text } from "@mychat/ui/native/Text";

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
