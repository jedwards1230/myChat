import { useEffect, useState } from "react";

import type { Agent } from "@/types";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/Dialog";
import { AgentView } from "./AgentView";

export function AgentDialog({
	existingAgent,
	children,
	className,
	open,
	onClose,
	edit = false,
}: {
	existingAgent?: Agent | null;
	children?: React.ReactNode;
	className?: string;
	open?: boolean;
	onClose?: () => void;
	edit?: boolean;
}) {
	const [agent, setAgent] = useState<Agent | null>(existingAgent || null);
	useEffect(() => setAgent(existingAgent || null), [existingAgent]);

	return (
		<Dialog open={open} onOpenChange={onClose} className="w-full">
			{children && (
				<DialogTrigger asChild className={className}>
					{children}
				</DialogTrigger>
			)}

			<DialogContent className="flex flex-col justify-center text-foreground">
				<DialogTitle className="text-center">Agent</DialogTitle>
				<DialogDescription className="flex flex-col gap-4">
					<AgentView agent={agent} />
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}
