import { Section } from "@/components/ui/Section";
import ModalWrapper from "@/components/ui/Modal";
import { ResetDefaultsButton, StreamToggle, ToggleThemeButton } from "./helpers";
import { HostConfig } from "./helpers/HostConfig";
import { DeviceConfig } from "./helpers/DeviceConfig";
import { UserConfig } from "./helpers/UserConfig";

export default function SettingsModal() {
	return (
		<ModalWrapper title="Settings">
			<Section title="Chat Host">
				<HostConfig />
				<ToggleThemeButton />
				<StreamToggle />
			</Section>
			<ResetDefaultsButton />
			<DeviceConfig />
			<UserConfig />
		</ModalWrapper>
	);
}
