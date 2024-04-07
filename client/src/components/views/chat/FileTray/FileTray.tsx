import { Pressable, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";

import { useFileStore } from "@/hooks/stores/fileStore";
import { FileButton } from "./FileButton";
import { FontAwesome } from "@/components/ui/Icon";

export function FileTray() {
	const fileList = useFileStore((state) => state.fileList);

	if (!fileList.length) return null;
	return (
		<View className="flex flex-row justify-start w-full gap-4 pt-2">
			{fileList.map((file, index) => (
				<FileButton key={index} file={file} />
			))}
		</View>
	);
}

export function FileInputButton() {
	const addAssets = useFileStore((state) => state.addAssets);
	const triggerFileInput = async () => {
		const res = await DocumentPicker.getDocumentAsync({ multiple: true });
		if (res.assets && res.assets.length > 0) addAssets(res.assets);
		if (res.canceled) console.log({ res });
	};

	// TODO: Fix uploads on native
	return null;
	return (
		<Pressable
			onPress={triggerFileInput}
			className="absolute left-0 p-1 bg-transparent rounded-full"
		>
			<FontAwesome name="paperclip" size={22} className="text-foreground" />
		</Pressable>
	);
}
