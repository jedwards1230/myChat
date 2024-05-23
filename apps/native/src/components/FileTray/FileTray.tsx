import { Pressable, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useFileStore } from "@/hooks/stores/fileStore";
import { parseLocalFiles } from "@/hooks/useFileInformation";

import { Icon } from "@mychat/ui/native/Icon";

import { FileButton } from "./FileButton";

export function FileTray() {
	const fileList = useFileStore((state) => state.fileList);

	if (!fileList.length) return null;
	return (
		<View className="flex w-full flex-row justify-start gap-4 pt-2">
			{fileList.map((file, index) => (
				<FileButton key={index} data={{ file }} />
			))}
		</View>
	);
}

export function FileInputButton() {
	const addFiles = useFileStore((state) => state.addFiles);
	const triggerFileInput = async () => {
		const res = await DocumentPicker.getDocumentAsync({ multiple: true });
		if (!res.assets) return console.warn("No files selected");
		const files = await parseLocalFiles(res.assets);
		if (res.assets.length > 0) addFiles(files);
	};

	// TODO: Fix uploads on native
	return null;
	return (
		<Pressable
			onPress={triggerFileInput}
			className="absolute left-0 rounded-full bg-transparent p-1"
		>
			<Icon
				type="FontAwesome"
				name="paperclip"
				size={22}
				className="text-foreground"
			/>
		</Pressable>
	);
}
