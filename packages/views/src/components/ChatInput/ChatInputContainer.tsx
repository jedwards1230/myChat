"use client";

import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import { AngleUp, StopCircle } from "@mychat/ui/svg";

import type { FormSubmission } from "../../hooks/useChat";
import { CommandTray } from "../CommandTray";
import { FileInputButton, FileTray } from "../FileTray";
import ChatInput from "./ChatInput";

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
			<View className="relative mb-2 mt-2 flex w-full flex-col items-center justify-between rounded-xl border border-2 border-input px-1 web:mx-auto md:max-w-[90%] lg:max-w-[75%]">
				<FileTray />
				<CommandTray input={input} />
				<View className="flex w-full flex-row items-center justify-between pl-2 pr-2 web:pr-10">
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
			className="absolute right-0 rounded-full bg-transparent p-1 web:right-2"
		>
			<AngleUp />
		</Pressable>
	);
}

function StopButton({ abort }: { abort: () => void }) {
	return (
		<Pressable
			onPress={abort}
			className="absolute right-0 rounded-full bg-transparent p-1 web:right-2"
		>
			<StopCircle />
		</Pressable>
	);
}
