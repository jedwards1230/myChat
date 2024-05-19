import type { Agent } from "@/types";
import Toast from "react-native-toast-message";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/Dialog";
import { useAgentQuery } from "@/hooks/fetchers/Agent/useAgentQuery";
import { AgentView } from "@/views/agent/AgentView";

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
		Toast.show({
			type: "error",
			text1: "Error fetching agent",
			text2: agentQuery.error.message,
		});
		return null;
	}
	return (
		<Dialog open={open} onOpenChange={onClose} className="w-full">
			{children && (
				<DialogTrigger asChild className={className}>
					{children}
				</DialogTrigger>
			)}

			<DialogContent className="flex max-h-[90vh] min-w-[80vw] flex-col justify-start overflow-y-scroll text-foreground md:min-w-[60vw]">
				<DialogTitle className="text-center">Agent</DialogTitle>
				<DialogDescription className="flex flex-col gap-4">
					<AgentView agent={agentQuery.data} />
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}
