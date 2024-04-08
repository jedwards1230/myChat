import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { RemoveFolderButton } from "./DeleteButton";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FileRouter, RouterChildrenProps, RouterData } from "../FileRouter";

export function FolderButton({
	baseDir,
	data,
	routerProps,
}: {
	baseDir: string;
	data: RouterData;
	routerProps?: RouterChildrenProps;
}) {
	const [open, setOpen] = useState(false);
	const levels = baseDir.split("/").length;

	const colorMap = [
		"bg-foreground/5",
		"bg-foreground/10",
		"bg-foreground/20",
		"bg-foreground/30",
		"bg-foreground/40",
		"bg-foreground/50",
		"bg-foreground/60",
		"bg-foreground/70",
		"bg-foreground/80",
	];

	if (levels > colorMap.length)
		console.error("Too many levels in folder button", baseDir);

	return (
		<View
			className={cn(
				"flex flex-row rounded-lg flex-wrap items-start justify-start flex-shrink gap-2",
				open ? colorMap[levels] : "",
				open ? "p-1" : ""
			)}
		>
			<View className="relative">
				<Pressable onPress={() => setOpen(!open)} className="bg-foreground/5">
					<Text className="px-4 py-2 border-2 rounded border-border text-foreground">
						{baseDir}
					</Text>
				</Pressable>
				<RemoveFolderButton files={data.files} />
			</View>
			{open && (
				<FileRouter
					data={data}
					parentDir={baseDir}
					routerComponents={routerProps}
				/>
			)}
		</View>
	);
}
