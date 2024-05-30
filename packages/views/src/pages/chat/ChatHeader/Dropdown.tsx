"use client";

import { useState } from "react";

import { api } from "@mychat/api/client/react-query";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@mychat/ui/native/DropdownMenu";
import { Text } from "@mychat/ui/native/Text";
import { AngleRight } from "@mychat/ui/svg";

import { AgentDialog } from "../../agent/AgentDialog.web";

export function Dropdown({
	children,
	className,
	threadId,
}: {
	children: React.ReactNode;
	className?: string;
	threadId: string | null;
}) {
	//const threadQuery = useThreadQuery(threadId);
	const threadQuery = api.thread.byId.useQuery(
		{ id: threadId ?? "" },
		{ enabled: !!threadId },
	);
	const { data } = api.user.byId.useQuery({ id: threadQuery.data?.userId ?? "" });
	const currentAgentId = threadId ? threadQuery.data?.agentId : data?.defaultAgentId;
	const agentQuery = api.agent.byId.useQuery(
		{ id: currentAgentId ?? "" },
		{ enabled: !!currentAgentId },
	);

	const [open, setOpen] = useState(false);
	const [agentOpen, setAgentOpen] = useState(false);

	const { mutateAsync: deleteThread } = api.thread.delete.useMutation();

	const { data: messages } = api.message.all.useQuery();

	const tokens = messages?.reduce((acc, m) => acc + m.tokenCount || 0, 0) ?? 0;

	const openAgentMenu = () => setAgentOpen(true);

	const actions = [
		{
			label: `Tokens: ${tokens} / ${agentQuery.data?.model.params.maxTokens}`,
			hidden: !agentQuery.data?.model || !threadId,
		},
		{
			label: "View Agent",
			onPress: openAgentMenu,
			Icon: AngleRight,
		} as const,
		{
			label: "Delete Thread",
			onPress: threadId ? () => deleteThread(threadId) : undefined,
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
									{action.Icon && (
										<DropdownMenuShortcut>
											<action.Icon />
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
