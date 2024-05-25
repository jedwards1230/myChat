import { View } from "react-native";

import { api } from "@mychat/api/client/react-query";

import ModalWrapper from "~/native/Modal";
import { Text } from "~/native/Text";

export default function AgentListModal() {
	const { data: agents, isSuccess } = api.agent.all.useQuery();

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
