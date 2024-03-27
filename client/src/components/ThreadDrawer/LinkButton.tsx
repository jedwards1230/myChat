import { Link, type Href } from "expo-router";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type PathNameProps = { pathname: string };

interface LinkButtonProps<T extends PathNameProps> {
	href: Href<T>;
	children?: React.ReactNode;
	className?: string;
}

export default function LinkButton<T extends PathNameProps>({
	href,
	children,
	className,
}: LinkButtonProps<T>) {
	return (
		<Link asChild href={href} className={cn("w-full", className)}>
			<Button variant="navItem" size="navItem">
				{children}
			</Button>
		</Link>
	);
}
