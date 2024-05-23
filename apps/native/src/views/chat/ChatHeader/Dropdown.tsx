import { useState } from "react";
import { useDeleteActiveThread } from "@/hooks/actions";
import { useAgentQuery } from "@/hooks/fetchers/Agent/useAgentQuery";
import { useMessagesQuery } from "@/hooks/fetchers/Message/useMessagesQuery";
import { useThreadQuery } from "@/hooks/fetchers/Thread/useThreadQuery";
import { useUserQuery } from "@/hooks/fetchers/User/useUserQuery";
import { AgentDialog } from "@/views/agent/AgentDialog.web";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@mychat/ui/native/DropdownMenu";
import { Icon } from "@mychat/ui/native/Icon";
import { Text } from "@mychat/ui/native/Text";

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
	const { data } = useUserQuery();
	const currentAgent = threadId ? threadQuery.data?.agent : data?.defaultAgent;
	const agentQuery = useAgentQuery(currentAgent?.id ?? "");

	const [open, setOpen] = useState(false);
	const [agentOpen, setAgentOpen] = useState(false);

	const deleteThread = useDeleteActiveThread();
	const { data: messages } = useMessagesQuery(threadId);

	const tokens = messages.reduce((acc, m) => acc + m.tokenCount || 0, 0) || 0;

	const openAgentMenu = () => setAgentOpen(true);

	const actions = [
		{
			label: `Tokens: ${tokens} / ${agentQuery.data?.model.params.maxTokens}`,
			hidden: !agentQuery.data?.model || !threadId,
		},
		{
			label: "View Agent",
			onPress: openAgentMenu,
			icon: "Entypo",
			iconLabel: "chevron-right",
		} as const,
		{
			label: "Delete Thread",
			onPress: threadId ? () => deleteThread.action(threadId) : undefined,
			hidden: !threadId,
		},
		{
			label: "Share Thread",
			disabled: true,
			hidden: !threadId,
		},
	];

	return (
		<>
			<DropdownMenu open={open} onOpenChange={(newVal) => setOpen(newVal)}>
				<DropdownMenuTrigger className={className}>
					{children}
				</DropdownMenuTrigger>
				<DropdownMenuContent className="native:w-72 w-64">
					<DropdownMenuGroup>
						{actions.map((action, index) =>
							!action.hidden ? (
								<DropdownMenuItem
									key={index}
									disabled={action.disabled}
									onPress={() => action.onPress?.()}
								>
									<Text className="w-full">{action.label}</Text>
									{action.icon && (
										<DropdownMenuShortcut>
											<Icon
												type={action.icon}
												name={action.iconLabel}
											/>
										</DropdownMenuShortcut>
									)}
								</DropdownMenuItem>
							) : null,
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
