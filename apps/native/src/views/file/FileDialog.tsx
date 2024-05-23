import type { FileData } from "@/components/FileRouter";
import type { FileQueryOpts } from "@/hooks/useFileInformation";
import { Suspense, useState } from "react";
import { View } from "react-native";
import { CodeBlock } from "@/components/Markdown/CodeBlock";
import { useFileInformation } from "@/hooks/useFileInformation";

import { useColorScheme } from "@mychat/ui/hooks/useColorScheme";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@mychat/ui/native/Dialog";
import { Text } from "@mychat/ui/native/Text";

import { FileMetadata } from "./FileMetadata";

export function FileDialog({
	children,
	className,
	data,
}: {
	children: React.ReactNode;
	className?: string;
	data: FileData;
}) {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={(o) => setOpen(o)}>
			<DialogTrigger asChild className={className}>
				{children}
			</DialogTrigger>
			<DialogContent className="max-h-[90vh] w-screen max-w-[90vw] overflow-y-scroll !bg-background text-foreground">
				{open && (
					<Suspense fallback={<Text>Loading File Info...</Text>}>
						<FileView data={data} />
					</Suspense>
				)}
			</DialogContent>
		</Dialog>
	);
}

function FileView({ data }: { data: FileData }) {
	const file = data.file;
	const content = file.parsed ?? "";

	return (
		<>
			<View className="flex flex-row items-center justify-between">
				<DialogTitle>{file.name}</DialogTitle>
				<DialogClose>
					<Text>Close</Text>
				</DialogClose>
			</View>
			<DialogDescription className="flex flex-col gap-4">
				<FileMetadata file={file} />
				{content ? (
					<FileContent content={content} extension={file.extension} />
				) : "id" in data.file && data.query ? (
					<FileContentSuspense
						query={{ ...data.query, fileId: data.file.id }}
					/>
				) : null}
			</DialogDescription>
		</>
	);
}

function FileContentSuspense({ query }: { query: FileQueryOpts }) {
	const file = useFileInformation(query);

	if (!file.parsable || !file.parsed) return null;
	return <FileContent content={file.parsed} extension={file.extension} />;
}

function FileContent({ content, extension }: { content: string; extension?: string }) {
	const { colorScheme } = useColorScheme();

	return (
		<CodeBlock colorScheme={colorScheme} language={extension}>
			{content}
		</CodeBlock>
	);
}
