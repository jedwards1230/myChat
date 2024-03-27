import { Button } from "../../ui/Button";
import { useColorScheme } from "@/lib/useColorScheme";
import { Switch } from "../../ui/Switch";
import { Text } from "@/components/ui/Text";
import { RowItem } from "@/components/ui/Section";
import { useConfigStore } from "@/lib/stores/configStore";

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
