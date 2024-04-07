import { useEffect, useRef, useState } from "react";
import {
	NativeSyntheticEvent,
	TextInputChangeEventData,
	TextInputContentSizeChangeEventData,
	TextInputKeyPressEventData,
} from "react-native";

import { Input } from "@/components/ui/Input";
import { ChatInputProps } from "./types";

const maxRows = 25;

export default function ChatInput({
	threadId,
	input,
	setInput,
	handleSubmit,
}: ChatInputProps) {
	const [baseHeight, setBaseHeight] = useState(0);
	const ref = useRef<(typeof Input)["prototype"] | null>(null);

	useEffect(() => {
		if (ref.current) ref.current.focus();
	}, [threadId]);

	useEffect(() => {
		if (!input) return setBaseHeight(0);
	}, [input]);

	const onKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
		if (e.nativeEvent.key === "Enter" && !(e.nativeEvent as any).shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	const setHeight = (h: number) => {
		// set height to baseHeight + 20 * number of new lines
		const newHeight = Math.min(baseHeight + h * 22, maxRows * 22);
		ref.current?.style.setProperty("height", `${newHeight}px`);
	};

	const onChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
		// find all \n in event.text
		const newLines = e.nativeEvent.text.match(/\n/g);
		setHeight(newLines?.length || 0);
	};

	const onContentSizeChange = (
		e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
	) => {
		const h = e.nativeEvent.contentSize.height;
		if (baseHeight === 0) setBaseHeight(h);
	};

	return (
		<Input
			ref={ref}
			size="chat"
			variant="chat"
			value={input}
			placeholder="Message..."
			className="flex-1 pb-2 border-0 pl-14 md:pl-14 bg-background focus:outline-none text-foreground rounded-2xl"
			onContentSizeChange={onContentSizeChange}
			onChangeText={setInput}
			onKeyPress={onKeyPress}
			onChange={onChange}
			multiline
			autoFocus
		/>
	);
}
