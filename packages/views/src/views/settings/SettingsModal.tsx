import ModalWrapper from "~/native/Modal";
import { Section } from "~/native/Section";
import { ResetDefaultsButton, StreamToggle, ToggleThemeButton } from "./helpers";
import { DeviceConfig } from "./helpers/DeviceConfig";
import { UserConfig } from "./helpers/UserConfig";

export default function SettingsModal() {
	return (
		<ModalWrapper title="Settings">
			<Section title="Chat Host">
				<ToggleThemeButton />
				<StreamToggle />
			</Section>
			<ResetDefaultsButton />
			<DeviceConfig />
			<UserConfig />
		</ModalWrapper>
	);
}
