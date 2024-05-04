"use client";

import {
	CommandDialog as CommandDialogComponent,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/Command";
import { useActions } from "@/hooks/actions";

export function CommandDialog({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const { items } = useActions();

	return (
		<CommandDialogComponent open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Actions">
					{items.map(({ label, Icon, type, iconName, onClick, hidden }, i) =>
						!hidden ? (
							<CommandItem
								className="flex flex-row items-center gap-2 !cursor-pointer"
								onSelect={onClick}
								key={i}
							>
								<Icon type={type} name={iconName} />
								<span>{label}</span>
							</CommandItem>
						) : null
					)}
				</CommandGroup>
			</CommandList>
		</CommandDialogComponent>
	);
}
