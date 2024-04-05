import { useEffect, useRef, useState } from "react";
import {
	NativeSyntheticEvent,
	TextInputChangeEventData,
	TextInputContentSizeChangeEventData,
	TextInputKeyPressEventData,
} from "react-native";

import { Input } from "@/components/ui/Input";
import { useConfigStore } from "@/lib/stores/configStore";

const maxRows = 25;

export default function ChatInput({
	input,
	setInput,
	handleSubmit,
}: {
	input: string;
	setInput: (input: string) => void;
	handleSubmit: () => void;
}) {
	const [baseHeight, setBaseHeight] = useState(0);
	const ref = useRef<(typeof Input)["prototype"] | null>(null);
	const threadId = useConfigStore((state) => state.threadId);

	useEffect(() => {
		if (ref.current) ref.current.focus();
	}, [threadId]);

	useEffect(() => {
		if (!input) return setBaseHeight(0);
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSubmit();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [input]);

	const onKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
		if (e.nativeEvent.key === "Enter" && !(e.nativeEvent as any).shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	const onChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
		// find all \n in event.text
		const newLines = e.nativeEvent.text.match(/\n/g);
		// set height to baseHeight + 20 * number of new lines
		const newHeight = Math.min(
			baseHeight + (newLines?.length || 0) * 22,
			maxRows * 22
		);
		// set height to newHeight
		ref.current?.style.setProperty("height", `${newHeight}px`);
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
