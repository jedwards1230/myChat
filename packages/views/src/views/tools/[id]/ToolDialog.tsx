import { Link } from "expo-router";

export function ToolDialog({
	children,
}: {
	children?: React.ReactNode;
	className?: string;
	open?: boolean;
	onClose?: () => void;
}) {
	return (
		<Link className="flex-1" href="/(app)/tools/id">
			{children}
		</Link>
	);
}
