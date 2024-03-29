import { Platform, Pressable, View } from "react-native";
import { useEffect, useState } from "react";
import * as DocumentPicker from "expo-document-picker";

import { FormSubmission } from "@/lib/useChat";
import { useFileStore } from "@/lib/stores/fileStore";
import { FontAwesome, MaterialIcons } from "@/components/ui/Icon";
import ChatInput from "./ChatInput";
import { FileTray } from "./FileTray";
import { useConfigStore } from "@/lib/stores/configStore";

export function ChatInputContainer({
	handleSubmit,
	abort,
	loading = false,
}: {
	handleSubmit: FormSubmission;
	abort: () => void;
	loading?: boolean;
}) {
	const threadId = useConfigStore((state) => state.threadId);
	const [input, setInput] = useState("");
	useEffect(() => setInput(""), [threadId]);

	const addAssets = useFileStore((state) => state.addAssets);
	const triggerFileInput = async () => {
		const res = await DocumentPicker.getDocumentAsync({ multiple: true });
		if (res.assets && res.assets.length > 0) addAssets(res.assets);
		if (res.canceled) console.log({ res });
	};

	const handleSend = async () => {
		try {
			await handleSubmit(input);
			setInput("");
		} catch (error) {
			alert(error);
		}
	};

	return (
		<View className="w-full px-2 pt-2 web:mb-2">
			<View className="relative flex flex-col items-center justify-between w-full px-1 mt-2 mb-2 border border-2 border-input rounded-xl web:mx-auto md:max-w-[90%] lg:max-w-[75%]">
				<FileTray />
				<View className="flex flex-row items-center justify-between w-full pl-2 pr-2 web:pr-10">
					<ChatInput
						input={input}
						setInput={setInput}
						handleSubmit={handleSend}
					/>
					<FileButton triggerFileInput={triggerFileInput} />
					{loading ? (
						<StopButton abort={abort} />
					) : (
						<SendButton handleSend={handleSend} />
					)}
				</View>
			</View>
		</View>
	);
}

function FileButton({ triggerFileInput }: { triggerFileInput: () => void }) {
	return (
		<Pressable
			onPress={triggerFileInput}
			className="absolute left-0 p-1 bg-transparent rounded-full web:left-2"
		>
			<FontAwesome name="paperclip" size={22} className="text-foreground" />
		</Pressable>
	);
}

function SendButton({ handleSend }: { handleSend: () => void }) {
	return (
		<Pressable
			onPress={handleSend}
			className="absolute right-0 p-1 bg-transparent rounded-full web:right-2"
		>
			<MaterialIcons
				name={Platform.select({
					web: "keyboard-arrow-up",
					default: "chevron-right",
				})}
				size={22}
				className="text-foreground"
			/>
		</Pressable>
	);
}

function StopButton({ abort }: { abort: () => void }) {
	return (
		<Pressable
			onPress={abort}
			className="absolute right-0 p-1 bg-transparent rounded-full web:right-2"
		>
			<MaterialIcons name="stop" size={22} className="text-foreground" />
		</Pressable>
	);
}
