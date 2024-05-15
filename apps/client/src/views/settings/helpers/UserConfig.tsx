import { RowItem, Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { useUserData } from "@/hooks/stores/useUserData";
import { LogoutButton } from "../helpers";
import { useThreadListQuery } from "@/hooks/fetchers/Thread/useThreadListQuery";
import { Button } from "@/components/ui/Button";
import { useDeleteAllThreads } from "@/hooks/actions";

export function UserConfig() {
	const user = useUserData.use.user();
	const session = useUserData.use.session();
	const { data: threadList } = useThreadListQuery();
	const { action: deleteAllThreads } = useDeleteAllThreads();

	return (
		<>
			<Section title="Server Data">
				<RowItem>
					<Text>Thread Count</Text>
					<Text>{threadList?.length}</Text>
				</RowItem>
				<Button variant="destructive" onPress={deleteAllThreads}>
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
						defaultAgent: user.defaultAgent.id,
					}).map(([k, v], i) =>
						v ? (
							<RowItem key={i}>
								<Text>{k}</Text>
								<Text>{v.toString()}</Text>
							</RowItem>
						) : null
					)}
			</Section>
			<Section title="Session Data">
				{session &&
					Object.entries(session).map(([k, v], i) => (
						<RowItem key={i}>
							<Text>{k}</Text>
							<Text>{v.toString()}</Text>
						</RowItem>
					))}
				<LogoutButton />
			</Section>
		</>
	);
}
