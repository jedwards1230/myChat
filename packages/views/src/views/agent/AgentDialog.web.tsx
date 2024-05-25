import Toast from "react-native-toast-message";

import type { Agent } from "@mychat/db/schema";
import { api } from "@mychat/api/client/react-query";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@mychat/ui/native/Dialog";

import { AgentView } from "./AgentView";

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
	const { data, isPending, isError, error, isSuccess } = api.agent.byId.useQuery({
		id: existingAgent.id,
	});

	if (isPending) return null;
	if (isError) {
		console.error(error);
		Toast.show({
			type: "error",
			text1: "Error fetching agent",
			text2: error.message,
		});
		return null;
	}
	if (!isSuccess || !data) return null;
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
					<AgentView agent={data} />
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}
