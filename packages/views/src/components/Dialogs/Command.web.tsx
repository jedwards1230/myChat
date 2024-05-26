"use client";

import { useActions } from "@mychat/ui/hooks/useActions";
import {
	CommandDialog as CommandDialogComponent,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@mychat/ui/native/Command";
import { AngleRight } from "@mychat/ui/svg";

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
					{items.map(({ label, onClick, hidden }, i) =>
						!hidden ? (
							<CommandItem
								className="flex !cursor-pointer flex-row items-center gap-2"
								onSelect={() => onClick?.()}
								key={i}
							>
								<AngleRight />
								<span>{label}</span>
							</CommandItem>
						) : null,
					)}
				</CommandGroup>
			</CommandList>
		</CommandDialogComponent>
	);
}
