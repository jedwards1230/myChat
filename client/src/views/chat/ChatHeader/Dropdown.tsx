import { useState } from "react";

import { useAction } from "@/hooks/useAction";
import { useAgentStore } from "@/hooks/stores/agentStore";
import { useMessagesQuery } from "@/hooks/fetchers/Message/useMessagesQuery";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Text } from "@/components/ui/Text";
import { AgentDialog } from "@/views/agent/AgentDialog.web";
import { Entypo } from "@/components/ui/Icon";
import { useThreadQuery } from "@/hooks/fetchers/Thread/useThreadQuery";
import { useAgentQuery } from "@/hooks/fetchers/Agent/useAgentQuery";
import { useUser } from "@/hooks/useUser";

export function Dropdown({
	children,
	className,
	threadId,
}: {
	children: React.ReactNode;
	className?: string;
	threadId: string | null;
}) {
	const threadQuery = useThreadQuery(threadId);
	const {
		data: { user },
	} = useUser();
	const currentAgent = threadId ? threadQuery.data?.agent : user?.defaultAgent;
	const agentQuery = useAgentQuery(currentAgent?.id || "");
	const { model } = useAgentStore();

	const [open, setOpen] = useState(false);
	const [agentOpen, setAgentOpen] = useState(false);

	const deleteThread = useAction("deleteThread")();
	const { data: messages } = useMessagesQuery(threadId);

	const tokens = messages?.reduce((acc, m) => acc + m.tokenCount || 0, 0) || 0;

	const openAgentMenu = () => setAgentOpen(true);

	const actions = [
		{
			label: `Tokens: ${tokens} / ${model?.params.maxTokens}`,
			hidden: !model,
		},
		{
			label: "View Agent",
			onPress: openAgentMenu,
			icon: Entypo,
			iconLabel: "chevron-right",
		},
		{
			label: "Delete Thread",
			onPress: () => deleteThread.action(threadId!),
		},
		{
			label: "Share Thread",
			disabled: true,
		},
	];

	if (agentQuery.isError) {
		console.error(agentQuery.error);
	}
	return (
		<>
			<DropdownMenu open={open} onOpenChange={(newVal) => setOpen(newVal)}>
				<DropdownMenuTrigger className={className}>
					{children}
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-64 native:w-72">
					<DropdownMenuGroup>
						{actions.map((action, index) =>
							!action.hidden ? (
								<DropdownMenuItem
									className="cursor-pointer"
									key={index}
									disabled={action.disabled}
									onPress={
										action.onPress
											? (e) => action.onPress()
											: undefined
									}
								>
									<Text>{action.label}</Text>
									{action.icon && (
										<DropdownMenuShortcut>
											<action.icon name={action.iconLabel as any} />
										</DropdownMenuShortcut>
									)}
								</DropdownMenuItem>
							) : null
						)}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			{agentQuery.data && (
				<AgentDialog
					existingAgent={agentQuery.data}
					open={agentOpen}
					onClose={() => setAgentOpen(false)}
				/>
			)}
		</>
	);
}
