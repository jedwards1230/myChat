import React, { useEffect } from "react";

import { CommandDialog } from "@/components/Dialogs/Command.web";
import { useCmdDialog } from "@/hooks/stores/cmdDialogStore";

export function HotkeyProvider({ children }: { children: React.ReactNode }) {
	const { isOpen, setOpen, toggleDialog } = useCmdDialog();

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
			<CommandDialog open={isOpen} setOpen={setOpen} />
			{children}
		</>
	);
}
