import { useColorScheme } from "@/hooks/useColorScheme";
import { useConfigStore } from "@/hooks/stores/configStore";

import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Text } from "@/components/ui/Text";
import { RowItem } from "@/components/ui/Section";
import { useUserData } from "@/hooks/stores/useUserData";

export function ToggleThemeButton() {
	const { colorScheme, toggleColorScheme } = useColorScheme();

	return (
		<RowItem>
			<Text>Dark Mode</Text>
			<Switch
				checked={colorScheme === "dark"}
				onCheckedChange={async (value) => {
					toggleColorScheme();
				}}
			/>
		</RowItem>
	);
}

export function LogoutButton() {
	const logout = useUserData((s) => s.logout);
	return (
		<Button variant="destructive" onPress={logout}>
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
