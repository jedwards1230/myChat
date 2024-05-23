import type { FileInformation, FileQueryOpts } from "@/hooks/useFileInformation";
import { View } from "react-native";
import { CodeBlock } from "@/components/Markdown/CodeBlock";
import { useFileInformation } from "@/hooks/useFileInformation";

import { useColorScheme } from "@mychat/ui/hooks/useColorScheme";
import ModalWrapper from "@mychat/ui/native/Modal";

import { FileMetadata } from "./FileMetadata";

export default function FileModal({
	file,
	fileMeta,
}: {
	file?: FileInformation;
	fileMeta?: FileQueryOpts;
}) {
	if (file) {
		return (
			<ModalWrapper title={file.name}>
				<FileView file={file} />
			</ModalWrapper>
		);
	}

	if (!fileMeta) return null;
	return (
		<ModalWrapper title={"File Modal Title"}>
			<FileQueryView file={fileMeta} />
		</ModalWrapper>
	);
}

function FileQueryView({ file }: { file: FileQueryOpts }) {
	const fileInfo = useFileInformation(file);
	return <FileView file={fileInfo} />;
}

export function FileView({ file }: { file: FileInformation }) {
	const { colorScheme } = useColorScheme();
	const content = file.parsed ?? "";

	return (
		<View className="mx-auto flex w-full flex-col gap-2 px-4 text-center">
			<FileMetadata file={file} />
			{content && (
				<CodeBlock colorScheme={colorScheme} language={file.extension}>
					{content}
				</CodeBlock>
			)}
		</View>
	);
}
