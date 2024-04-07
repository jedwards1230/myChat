import { View } from "react-native";

import { CacheFile } from "@/types";
import { useColorScheme } from "@/hooks/useColorScheme";

import { Text } from "@/components/ui/Text";
import ModalWrapper from "@/components/ui/Modal";
import { CodeBlock } from "@/components/Markdown/CodeBlock";

import { FileInformation } from "./FileInformation";
import { FileMetadata, useFileInformation } from "./useFileInformation";

export default function FileModal({ file }: { file: CacheFile | FileMetadata }) {
	const { colorScheme } = useColorScheme();
	const fileInfo = useFileInformation(file);
	const content = fileInfo?.parsed || "";

	return (
		<ModalWrapper title={fileInfo.name}>
			<View className="flex flex-col w-full gap-2 px-4 mx-auto text-center">
				<FileInformation file={fileInfo} />
				{content && (
					<CodeBlock colorScheme={colorScheme} language={fileInfo.extension}>
						{content}
					</CodeBlock>
				)}
			</View>
		</ModalWrapper>
	);
}
