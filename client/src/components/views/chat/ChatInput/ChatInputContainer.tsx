import { Platform, Pressable, View } from "react-native";
import { useEffect, useState } from "react";

import { FormSubmission } from "@/hooks/useChat";
import { MaterialIcons } from "@/components/ui/Icon";
import { FileInputButton, FileTray } from "../FileTray";
import ChatInput from "./ChatInput";
import { CommandTray } from "../CommandTray";

export function ChatInputContainer({
	handleSubmit,
	abort,
	loading = false,
	threadId,
}: {
	handleSubmit: FormSubmission;
	abort: () => void;
	loading?: boolean;
	threadId: string | null;
}) {
	const [input, setInput] = useState("");
	useEffect(() => setInput(""), [threadId]);

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
				<CommandTray input={input} />
				<View className="flex flex-row items-center justify-between w-full pl-2 pr-2 web:pr-10">
					<ChatInput
						threadId={threadId}
						input={input}
						setInput={setInput}
						handleSubmit={handleSend}
					/>
					<FileInputButton />
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
