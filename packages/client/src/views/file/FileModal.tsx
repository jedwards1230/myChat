import { View } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";

import ModalWrapper from "@/components/ui/Modal";
import { CodeBlock } from "@/components/Markdown/CodeBlock";

import { FileMetadata } from "./FileMetadata";
import {
	FileInformation,
	FileQueryOpts,
	useFileInformation,
} from "@/hooks/useFileInformation";

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
	const content = file?.parsed || "";

	return (
		<View className="flex flex-col w-full gap-2 px-4 mx-auto text-center">
			<FileMetadata file={file} />
			{content && (
				<CodeBlock colorScheme={colorScheme} language={file.extension}>
					{content}
				</CodeBlock>
			)}
		</View>
	);
}
