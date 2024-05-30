import React, { useEffect } from "react";

import { useCmdDialog } from "@mychat/shared/hooks/stores/cmdDialogStore";
import { CommandDialog } from "@mychat/ui/native/Command";

export function HotkeyProvider({ children }: { children: React.ReactNode }) {
	const { isOpen, toggleDialog } = useCmdDialog();

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.metaKey && e.key === "k") {
				e.preventDefault();
				toggleDialog();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<>
			<CommandDialog
				open={isOpen}
				//setOpen={setOpen}
			/>
			{children}
		</>
	);
}
