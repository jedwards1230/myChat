import { useEffect, useRef } from "react";

import { ChatInputProps } from "./types";
import { Textarea } from "../ui/Textarea";

export default function ChatInput({
	threadId,
	input,
	setInput,
	handleSubmit,
}: ChatInputProps) {
	const ref = useRef<(typeof Textarea)["prototype"] | null>(null);

	useEffect(() => {
		if (ref.current) ref.current.focus();
	}, [threadId]);

	return (
		<Textarea
			ref={ref}
			variant={"chat"}
			size={"chat"}
			value={input}
			placeholder="Message..."
			onChangeText={setInput}
			onSubmit={handleSubmit}
			multiline
			autoFocus
		/>
	);
}
