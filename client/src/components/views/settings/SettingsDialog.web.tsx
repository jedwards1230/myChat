import { useState } from "react";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/Dialog";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { ResetDefaultsButton, StreamToggle, ToggleThemeButton } from "./helpers";
import { HostConfig } from "./helpers/HostConfig";
import { DeviceConfig } from "./helpers/DeviceConfig";

export default function SettingsDialog({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const [isSaved, setIsSaved] = useState(false);

	return (
		<Dialog className="w-full">
			<DialogTrigger asChild className={className}>
				{children}
			</DialogTrigger>

			<DialogContent className="w-screen">
				<DialogTitle>Settings</DialogTitle>
				<DialogDescription className="flex flex-col gap-4">
					<Section title="Chat Host">
						<HostConfig />
						<ToggleThemeButton />
						<StreamToggle />
					</Section>
					{isSaved && <Text>Settings saved successfully!</Text>}
					<ResetDefaultsButton />
					<DeviceConfig />
				</DialogDescription>
				<DialogClose>
					<Text>Close</Text>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}
