import { Pressable } from "react-native";
import { Link, usePathname, useRouter } from "expo-router";

import { useHoverHelper } from "@mychat/ui/hooks/useHoverHelper";
import { Text, TextClassContext } from "@mychat/ui/native/Text";
import { useConfigStore } from "@mychat/ui/uiStore";
import { cn } from "@mychat/ui/utils";

interface LinkButtonProps {
	href: Parameters<typeof Link>[0]["href"];
	icon?: React.ReactNode;
	label?: string;
	children?: React.ReactNode;
	className?: string;
	isActive?: (props: { threadId: string | null; path: string }) => boolean;
}

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
		<TextClassContext.Provider
			value={
				"text-sm native:text-base group-aria-selected:text-background text-foreground transition-colors text-secondary-foreground"
			}
		>
			<Link href={href} asChild>
				<Pressable
					{...helpers}
					onPress={() => router.push(href)}
					role="tab"
					aria-selected={isActive?.({ threadId, path })}
					className={cn(
						"group flex w-full flex-row items-center justify-between gap-2 rounded p-2 transition-colors active:opacity-90 aria-selected:bg-foreground/10 web:justify-start web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
						isHover
							? "bg-secondary-foreground/10 dark:bg-secondary-foreground/50"
							: "bg-secondary",
						className,
					)}
				>
					{icon}
					{label && (
						<Text
							className="font-medium group-aria-selected:text-foreground"
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{label}
						</Text>
					)}
					{children}
				</Pressable>
			</Link>
		</TextClassContext.Provider>
	);
}
