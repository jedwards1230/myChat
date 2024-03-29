"use client";

import * as React from "react";

import {
	CommandDialog as CommandDialogComponent,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/Command";
import { FontAwesome } from "@/components/ui/Icon";
import { useConfigStore } from "@/lib/stores/configStore";
import { useDeleteThreadMutation } from "@/lib/mutations/useDeleteThreadMutation";
import { fetcher } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export function CommandDialog({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { threadId, user } = useConfigStore();
	const deleteThreadMutation = useDeleteThreadMutation(threadId);
	const queryClient = useQueryClient();

	const resetDb = async () => {
		await fetcher(["/reset", user.id]);
		queryClient.invalidateQueries();
	};

	const items = [
		{
			label: "Delete Active Thread",
			Icon: FontAwesome,
			iconName: "trash" as const,
			onClick: async () => {
				if (!deleteThreadMutation) return console.error("No thread or userId");
				deleteThreadMutation.mutate();
			},
			hidden: !threadId,
		},
		{
			label: "Reset DB",
			Icon: FontAwesome,
			iconName: "database" as const,
			onClick: resetDb,
		},
	];

	return (
		<CommandDialogComponent open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Actions">
					{items.map(({ label, Icon, iconName, onClick, hidden }, i) =>
						!hidden ? (
							<CommandItem
								className="flex flex-row items-center gap-2 !cursor-pointer"
								onSelect={onClick}
								key={i}
							>
								<Icon name={iconName} />
								<span>{label}</span>
							</CommandItem>
						) : null
					)}
				</CommandGroup>
			</CommandList>
		</CommandDialogComponent>
	);
}
