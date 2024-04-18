import type { Agent } from "@/types";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/Dialog";
import { AgentView } from "@/views/agent/AgentView";
import { useAgentQuery } from "@/hooks/fetchers/Agent/useAgentQuery";

export function AgentDialog({
	existingAgent,
	children,
	className,
	open,
	onClose,
}: {
	existingAgent: Agent;
	children?: React.ReactNode;
	className?: string;
	open?: boolean;
	onClose?: () => void;
}) {
	const agentQuery = useAgentQuery(existingAgent.id);

	if (agentQuery.isPending) return null;
	if (agentQuery.isError) {
		console.error(agentQuery.error);
		return null;
	}
	return (
		<Dialog open={open} onOpenChange={onClose} className="w-full">
			{children && (
				<DialogTrigger asChild className={className}>
					{children}
				</DialogTrigger>
			)}

			<DialogContent className="flex flex-col min-w-[60vw] max-h-[90vh] overflow-y-scroll justify-start text-foreground">
				<DialogTitle className="text-center">Agent</DialogTitle>
				<DialogDescription className="flex flex-col gap-4">
					<AgentView agent={agentQuery.data} />
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}
