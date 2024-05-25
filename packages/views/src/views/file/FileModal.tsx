import { View } from "react-native";

import type { FileInformation } from "@mychat/ui/hooks/useFileInformation";
import { useFileInformation } from "@mychat/ui/hooks/useFileInformation";
import { CodeBlock } from "@mychat/ui/Markdown/CodeBlock";

import { useColorScheme } from "~/hooks/useColorScheme";
import ModalWrapper from "~/native/Modal";
import { FileMetadata } from "./FileMetadata";

export default function FileModal({
	file,
	fileMeta,
}: {
	file?: FileInformation;
	fileMeta?: { fileId: string };
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

function FileQueryView({ file }: { file: { fileId: string } }) {
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
