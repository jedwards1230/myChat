import { useEffect, useState } from "react";
import { View } from "react-native";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/Dialog";
import { CacheFile } from "@/types";
import { useColorScheme } from "@/lib/useColorScheme";
import { Text } from "@/components/ui/Text";
import { FileInformation } from "./FileInformation";
import { CodeBlock } from "@/components/Markdown/CodeBlock";

export default function FileDialog({
	children,
	className,
	file,
}: {
	children: React.ReactNode;
	className?: string;
	file: CacheFile;
}) {
	const { colorScheme } = useColorScheme();

	const fileExt = file.name.split(".").pop();

	const [content, setContent] = useState<string | null>(null);
	useEffect(() => {
		const update = async () => {
			if (file?.file) {
				const text = await file.file.text();
				setContent(text);
			}
		};
		update();
	}, [file]);

	return (
		<Dialog>
			<DialogTrigger asChild className={className}>
				{children}
			</DialogTrigger>
			<DialogContent className="w-screen max-h-[90vh] max-w-[90vw] overflow-y-scroll !bg-background text-foreground">
				<View className="flex flex-row items-center justify-between">
					<DialogTitle>{file.name}</DialogTitle>
					<DialogClose>
						<Text>Close</Text>
					</DialogClose>
				</View>
				<DialogDescription className="flex flex-col gap-4">
					<FileInformation file={file} />
					{content && (
						<CodeBlock colorScheme={colorScheme} language={fileExt}>
							{content}
						</CodeBlock>
					)}
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}
