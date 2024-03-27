import { MaterialIcons } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import SettingsDialog from "@/components/views/settings/SettingsDialog.web";
import { Button } from "@/components/ui/Button";

export function SettingsButton() {
	return (
		<SettingsDialog className="w-full">
			<Button variant="navItem" size="navItem">
				<MaterialIcons
					name="settings"
					size={20}
					className="text-secondary-foreground"
				/>
				<Text className="font-medium">Settings</Text>
			</Button>
		</SettingsDialog>
	);
}
