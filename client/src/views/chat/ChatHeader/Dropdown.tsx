import { useState } from "react";

import { useAction } from "@/hooks/useAction";
import { useAgentStore } from "@/hooks/stores/agentStore";
import { useConfigStore } from "@/hooks/stores/configStore";
import { useMessagesQuery } from "@/hooks/queries/useMessagesQuery";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Text } from "@/components/ui/Text";
import { AgentDialog } from "@/components/Dialogs/AgentDialog.web";
import { Entypo } from "@/components/ui/Icon";

export function Dropdown({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const { threadId } = useConfigStore();
	const { agent, model } = useAgentStore();

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
			<AgentDialog
				existingAgent={agent}
				open={agentOpen}
				onClose={() => setAgentOpen(false)}
			/>
		</>
	);
}
