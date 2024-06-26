import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { RemoveFolderButton } from "./DeleteButton";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FileRouter, type RouterChildrenProps, type RouterData } from "../FileRouter";

export function FolderButton({
	baseDir,
	data,
	routerComponents,
}: {
	baseDir: string;
	data: RouterData;
	routerComponents: RouterChildrenProps;
}) {
	const [open, setOpen] = useState(false);
	const levels = baseDir.split("/").length;

	if (levels > colorMap.length)
		console.error("Too many levels in folder button", baseDir);

	return (
		<View
			aria-selected={open}
			className={cn(
				"flex flex-row aria-selected:p-1 rounded-lg flex-wrap items-start justify-start flex-shrink gap-2",
				open ? colorMap[levels]?.[0] : ""
			)}
		>
			<View className="relative">
				<Pressable
					aria-selected={open}
					onPress={() => setOpen(!open)}
					className={cn(
						"border-2 rounded border-border",
						colorMap[levels]?.[1]
					)}
				>
					<Text className="px-4 py-2 text-foreground">{baseDir}</Text>
				</Pressable>
				<RemoveFolderButton files={data.files} />
			</View>
			{open && (
				<FileRouter
					data={data}
					parentDir={baseDir}
					routerComponents={routerComponents}
				/>
			)}
		</View>
	);
}

const colorMap = [
	[
		"bg-foreground/5",
		"bg-foreground/5 aria-selected:border-foreground/50 hover:bg-foreground/10",
	],
	[
		"bg-foreground/10",
		"bg-foreground/10 aria-selected:border-foreground/50 hover:bg-foreground/15",
	],
	[
		"bg-foreground/15",
		"bg-foreground/15 aria-selected:border-foreground/50 hover:bg-foreground/20",
	],
	[
		"bg-foreground/20",
		"bg-foreground/20 aria-selected:border-foreground/50 hover:bg-foreground/25",
	],
	[
		"bg-foreground/25",
		"bg-foreground/25 aria-selected:border-foreground/50 hover:bg-foreground/30",
	],
	[
		"bg-foreground/30",
		"bg-foreground/30 aria-selected:border-foreground/50 hover:bg-foreground/35",
	],
	[
		"bg-foreground/35",
		"bg-foreground/35 aria-selected:border-foreground/50 hover:bg-foreground/70",
	],
	[
		"bg-foreground/40",
		"bg-foreground/40 aria-selected:border-foreground/50 hover:bg-foreground/80",
	],
	[
		"bg-foreground/45",
		"bg-foreground/45 aria-selected:border-foreground/50 hover:bg-foreground/90",
	],
] as const;
