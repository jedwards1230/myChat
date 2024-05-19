import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/Dialog";

import { ToolConfig } from "./ToolConfig";

export function ToolDialog({
	children,
	className,
	open,
	onClose,
}: {
	children?: React.ReactNode;
	className?: string;
	open?: boolean;
	onClose?: () => void;
}) {
	return (
		<Dialog open={open} onOpenChange={onClose}>
			{children && (
				<DialogTrigger asChild className={className}>
					{children}
				</DialogTrigger>
			)}

			<DialogContent className="flex max-h-[90vh] min-w-[80vw] flex-col justify-start overflow-y-scroll text-foreground md:min-w-[70vw]">
				<DialogTitle className="text-center">Tool</DialogTitle>
				<DialogDescription className="flex flex-col gap-4">
					<ToolConfig />
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}
