import { useState } from "react";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/Dialog";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { HostConfig } from "../../views/settings/helpers/HostConfig";

export default function ConnectHostDialog() {
	const [isSaved, setIsSaved] = useState(false);

	return (
		<Dialog open={true} className="w-full">
			<DialogContent>
				<DialogTitle>Settings</DialogTitle>
				<DialogDescription>
					<Section title="Chat Host">
						<HostConfig />
					</Section>
					{isSaved && <Text>Settings saved successfully!</Text>}
				</DialogDescription>
				<DialogClose>
					<Text>Close</Text>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}
