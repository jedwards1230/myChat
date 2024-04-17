import { RowItem, Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { useUserData } from "@/hooks/stores/useUserData";
import { LogoutButton } from "../helpers";
import { useThreadListQuery } from "@/hooks/queries/useThreadListQuery";

export function UserConfig() {
	const session = useUserData.use.session();
	const { data: threadList } = useThreadListQuery();

	return (
		<>
			<Section title="Server Data">
				<RowItem>
					<Text>Thread Count</Text>
					<Text>{threadList?.length}</Text>
				</RowItem>
			</Section>
			<Section title="Session Data">
				{session &&
					Object.entries(session).map(([k, v], i) => (
						<RowItem key={i}>
							<Text>{k}</Text>
							<Text>{v.toString()}</Text>
						</RowItem>
					))}
			</Section>
			<LogoutButton />
		</>
	);
}
