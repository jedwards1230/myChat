import { api } from "@mychat/api/client/react-query";
import { Button } from "@mychat/ui/native/Button";
import { RowItem, Section } from "@mychat/ui/native/Section";
import { Text } from "@mychat/ui/native/Text";

import { useUserData } from "../../../hooks/useUserData";
import { LogoutButton } from "../helpers";

export function UserConfig() {
	const user = useUserData.use.user();
	const session = useUserData.use.session();
	const { data: threadList } = api.thread.all.useQuery();
	const { mutateAsync: deleteAllThreads } = api.thread.deleteAll.useMutation();

	return (
		<>
			<Section title="Server Data">
				<RowItem>
					<Text>Thread Count</Text>
					<Text>{threadList?.length}</Text>
				</RowItem>
				<Button variant="destructive" onPress={() => deleteAllThreads}>
					<Text>Delete all threads</Text>
				</Button>
			</Section>
			<Section title="User Data">
				{user &&
					Object.entries({
						...user,
						threads: undefined,
						agents: undefined,
						tools: undefined,
						defaultAgent: user.defaultAgentId,
					}).map(([k, v], i) =>
						v ? (
							<RowItem key={i}>
								<Text>{k}</Text>
								<Text>{v.toString()}</Text>
							</RowItem>
						) : null,
					)}
			</Section>
			<Section title="Session Data">
				{session &&
					Object.entries(session).map(([k, v], i) => (
						<RowItem key={i}>
							<Text>{k}</Text>
							<Text>{v?.toString()}</Text>
						</RowItem>
					))}
				<LogoutButton />
			</Section>
		</>
	);
}
