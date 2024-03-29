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

export function CommandDialog({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { threadId, user } = useConfigStore();
	const deleteThreadMutation = useDeleteThreadMutation(threadId);

	const resetDb = () =>
		fetcher(["/reset", user.id]).then(() => console.log("DB Reset"));

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
								onSelect={onClick}
								onClick={onClick}
								className="flex items-center gap-2"
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
