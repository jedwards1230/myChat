import { api } from "@mychat/api/client/react-query";

import { useColorScheme } from "~/hooks/useColorScheme";
import { Button } from "~/native/Button";
import { RowItem } from "~/native/Section";
import { Switch } from "~/native/Switch";
import { Text } from "~/native/Text";
import { useConfigStore } from "~/uiStore";

export function ToggleThemeButton() {
	const { colorScheme, toggleColorScheme } = useColorScheme();

	return (
		<RowItem>
			<Text>Dark Mode</Text>
			<Switch
				checked={colorScheme === "dark"}
				onCheckedChange={async () => {
					toggleColorScheme();
				}}
			/>
		</RowItem>
	);
}

export function LogoutButton() {
	const { mutate: logout } = api.user.logout.useMutation();
	return (
		<Button variant="destructive" onPress={() => logout("")}>
			<Text>Logout</Text>
		</Button>
	);
}

export function ResetDefaultsButton() {
	const reset = useConfigStore((state) => state.reset);
	return (
		<Button variant="destructive" onPress={reset}>
			<Text>Reset to defaults</Text>
		</Button>
	);
}

export function StreamToggle() {
	const { stream, setStream } = useConfigStore();
	return (
		<RowItem>
			<Text>Stream</Text>
			<Switch checked={stream} onCheckedChange={setStream} />
		</RowItem>
	);
}

export function DebugQueryToggle() {
	const { debugQuery, setDebugQuery } = useConfigStore();
	return (
		<RowItem>
			<Text>Debug Query</Text>
			<Switch checked={debugQuery} onCheckedChange={setDebugQuery} />
		</RowItem>
	);
}
