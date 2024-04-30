import { Link, usePathname, useRouter } from "expo-router";
import { Pressable } from "react-native";

import { cn } from "@/lib/utils";
import { TextClassContext } from "../ui/Text";
import { useHoverHelper } from "@/hooks/useHoverHelper";
import { Text } from "@/components/ui/Text";
import { useConfigStore } from "@/hooks/stores/configStore";

type LinkButtonProps = {
	href: Parameters<typeof Link>[0]["href"];
	icon?: React.ReactNode;
	label?: string;
	children?: React.ReactNode;
	className?: string;
	isActive?: (props: { threadId: string | null; path: string }) => boolean;
};

export default function LinkButton({
	href,
	icon,
	label,
	children,
	className,
	isActive,
}: LinkButtonProps) {
	const threadId = useConfigStore.use.threadId();
	const path = usePathname();
	const router = useRouter();
	const { isHover, ...helpers } = useHoverHelper();
	return (
		<Link href={href} asChild>
			<Pressable
				{...helpers}
				onPress={() => router.push(href)}
				role="tab"
				aria-selected={isActive?.({ threadId, path })}
				className={cn(
					"flex flex-row items-center justify-between w-full gap-2 p-2 transition-colors rounded group web:ring-offset-background aria-selected:bg-primary web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 active:opacity-90 web:justify-start",
					isHover
						? "bg-secondary-foreground/10 dark:bg-secondary-foreground/50"
						: "bg-secondary",
					className
				)}
			>
				<TextClassContext.Provider
					value={
						"web:whitespace-nowrap text-sm native:text-base group-aria-selected:text-background text-foreground transition-colors text-secondary-foreground"
					}
				>
					{icon}
					{label && (
						<Text className="font-medium" ellipsizeMode="tail">
							{label}
						</Text>
					)}
					{children}
				</TextClassContext.Provider>
			</Pressable>
		</Link>
	);
}
