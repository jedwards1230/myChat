import { RowItem, Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { useUserData } from "@/hooks/stores/useUserData";
import { LogoutButton } from "../helpers";

export function UserConfig() {
	const { session } = useUserData();

	return (
		<Section title="User Data">
			{session &&
				Object.entries(session).map(([k, v], i) => (
					<RowItem key={i}>
						<Text>{k}</Text>
						<Text>{v.toString()}</Text>
					</RowItem>
				))}
			<LogoutButton />
		</Section>
	);
}
