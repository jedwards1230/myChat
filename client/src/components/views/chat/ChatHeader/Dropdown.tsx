import { useEffect, useState } from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Text } from "@/components/ui/Text";
import { useConfigStore } from "@/lib/stores/configStore";
import { useDeleteThreadMutation } from "@/lib/mutations/useDeleteThreadMutation";
import { getTokenCount } from "@/lib/tokenizer";
import { useMessagesQuery } from "@/lib/queries/useMessagesQuery";
import { AgentDialog } from "../../agent/AgentDialog.web";
import { ModelManagerDialog } from "@/components/Dialogs/ModelManager.web";
import { useModelStore } from "@/lib/stores/modelStore";
import { Entypo } from "@/components/ui/Icon";

export function Dropdown({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const { model } = useModelStore();
	const { threadId } = useConfigStore();

	const [open, setOpen] = useState(false);
	const [agentOpen, setAgentOpen] = useState(false);
	const [modelManagerOpen, setModelManagerOpen] = useState(false);

	const { mutate: deleteThread } = useDeleteThreadMutation(threadId);
	const { data: messages } = useMessagesQuery(threadId);

	const [tokens, setTokens] = useState(0);
	useEffect(() => {
		const getCount = async () => {
			const count = await getTokenCount(
				messages?.map((m) => m.content).join(" ") || ""
			);
			setTokens(count);
		};
		getCount();
	}, [messages]);

	const openAgentMenu = () => setAgentOpen(true);
	const openModelManager = () => setModelManagerOpen(true);

	const actions = [
		{
			label: `Tokens: ${tokens}`,
		},
		{
			label: "View Agent",
			onPress: openAgentMenu,
			icon: Entypo,
			iconLabel: "chevron-right",
		},
		{
			label: model.name,
			onPress: openModelManager,
			icon: Entypo,
			iconLabel: "chevron-right",
		},
		{
			label: "Delete Thread",
			onPress: deleteThread,
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
						{actions.map((action, index) => (
							<DropdownMenuItem
								key={index}
								disabled={action.disabled}
								onPress={
									action.onPress ? (e) => action.onPress() : undefined
								}
							>
								<Text>{action.label}</Text>
								{action.icon && (
									<DropdownMenuShortcut>
										<action.icon name={action.iconLabel as any} />
									</DropdownMenuShortcut>
								)}
							</DropdownMenuItem>
						))}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<AgentDialog open={agentOpen} onClose={() => setAgentOpen(false)} />
			<ModelManagerDialog
				open={modelManagerOpen}
				onClose={() => setModelManagerOpen(false)}
			/>
		</>
	);
}
