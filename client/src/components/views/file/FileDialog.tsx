import { useEffect, useState } from "react";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/Dialog";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { FileInformation } from "./FileInformation";
import { CacheFile } from "@/types";

export default function FileDialog({
	children,
	className,
	file,
}: {
	children: React.ReactNode;
	className?: string;
	file: CacheFile;
}) {
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
		<Dialog className="w-full">
			<DialogTrigger asChild className={className}>
				{children}
			</DialogTrigger>

			<DialogContent className="w-screen max-h-[90vh] max-w-[90vw] overflow-y-scroll">
				<DialogTitle>{file.name}</DialogTitle>
				<DialogDescription className="flex flex-col gap-4">
					<a href={file.uri}>Download</a>
					<FileInformation file={file} />
					<Section title="File Content">
						<Text className="w-full overflow-auto">{content}</Text>
					</Section>
				</DialogDescription>
				<DialogClose>
					<Text>Close</Text>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}
