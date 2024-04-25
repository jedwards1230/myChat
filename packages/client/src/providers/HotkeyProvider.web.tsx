import React, { useEffect, useState } from "react";

import { CommandDialog } from "@/components/Dialogs/Command.web";

export function HotkeyProvider({ children }: { children: React.ReactNode }) {
	const [cmdDialogOpen, setCmdDialogOpen] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.metaKey && e.key === "k") {
				e.preventDefault();
				setCmdDialogOpen(!cmdDialogOpen);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<>
			<CommandDialog open={cmdDialogOpen} setOpen={setCmdDialogOpen} />
			{children}
		</>
	);
}
