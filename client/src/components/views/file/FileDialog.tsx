import { useState } from "react";
import { View } from "react-native";

import { CacheFile } from "@/types";
import { useColorScheme } from "@/lib/useColorScheme";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/Dialog";
import { Text } from "@/components/ui/Text";
import { CodeBlock } from "@/components/Markdown/CodeBlock";

import { FileInformation } from "./FileInformation";
import { FileMetadata, useFileInformation } from "./useFileInformation";

export default function FileDialog({
	children,
	className,
	file,
}: {
	children: React.ReactNode;
	className?: string;
	file: CacheFile | FileMetadata;
}) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={(o) => setOpen(o)}>
			<DialogTrigger asChild className={className}>
				{children}
			</DialogTrigger>
			<DialogContent className="w-screen max-h-[90vh] max-w-[90vw] overflow-y-scroll !bg-background text-foreground">
				{open && <FileView file={file} />}
			</DialogContent>
		</Dialog>
	);
}

function FileView({ file }: { file: CacheFile | FileMetadata }) {
	const { colorScheme } = useColorScheme();
	const fileInfo = useFileInformation(file);
	const content = fileInfo?.parsed || "";

	return (
		<>
			<View className="flex flex-row items-center justify-between">
				<DialogTitle>{fileInfo.name}</DialogTitle>
				<DialogClose>
					<Text>Close</Text>
				</DialogClose>
			</View>
			<DialogDescription className="flex flex-col gap-4">
				<FileInformation file={fileInfo} />
				{content && (
					<CodeBlock colorScheme={colorScheme} language={fileInfo.extension}>
						{content}
					</CodeBlock>
				)}
			</DialogDescription>
		</>
	);
}
