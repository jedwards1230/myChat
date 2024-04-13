import { useState } from "react";

import { Text } from "@/components/ui/Text";
import { Section } from "@/components/ui/Section";
import ModalWrapper from "@/components/ui/Modal";
import { ResetDefaultsButton, StreamToggle, ToggleThemeButton } from "./helpers";
import { HostConfig } from "./helpers/HostConfig";
import { DeviceConfig } from "./helpers/DeviceConfig";
import { UserConfig } from "./helpers/UserConfig";

export default function SettingsModal() {
	const [isSaved, setIsSaved] = useState(false);

	return (
		<ModalWrapper title="Settings">
			<Section title="Chat Host">
				<HostConfig />
				<ToggleThemeButton />
				<StreamToggle />
			</Section>
			<UserConfig />
			{isSaved && <Text className="text-center">Settings saved successfully!</Text>}
			<ResetDefaultsButton />
			<DeviceConfig />
		</ModalWrapper>
	);
}
