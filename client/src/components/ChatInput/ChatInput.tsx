import { useEffect, useRef } from "react";

import { Input } from "@/components/ui/Input";
import { ChatInputProps } from "./types";

export default function ChatInput({ threadId, input, setInput }: ChatInputProps) {
	const ref = useRef<any | null>(null);

	useEffect(() => {
		if (ref.current) {
			ref.current.focus();
		}
	}, [threadId]);

	return (
		<Input
			ref={ref}
			autoFocus
			variant="chat"
			size="chat"
			//className="pl-8"
			value={input}
			onChangeText={setInput}
			multiline
			placeholder="Message..."
		/>
	);
}
