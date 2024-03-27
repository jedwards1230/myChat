import { View } from "react-native";

import ModalWrapper from "@/components/ui/Modal";
import { FileInformation } from "./FileInformation";
import { CacheFile } from "@/types";

export default function FileModal({ cache, file }: { cache: boolean; file: CacheFile }) {
	return (
		<ModalWrapper title={file.name}>
			<View className="flex flex-col w-full gap-2 px-4 mx-auto text-center">
				<FileInformation file={file} />
			</View>
		</ModalWrapper>
	);
}
