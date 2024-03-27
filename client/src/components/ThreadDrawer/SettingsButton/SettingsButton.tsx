import { MaterialIcons } from "@/components/ui/Icon";
import LinkButton from "../LinkButton";
import { Text } from "@/components/ui/Text";

export function SettingsButton() {
	return (
		<LinkButton href={{ pathname: "/settings" }}>
			<MaterialIcons
				name="settings"
				size={20}
				className="text-secondary-foreground"
			/>
			<Text className="font-medium">Settings</Text>
		</LinkButton>
	);
}
