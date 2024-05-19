import { Input } from "@/components/ui/Input";

import type { ChatInputProps } from "./types";

export default function ChatInput({ input, setInput }: ChatInputProps) {
	return (
		<Input
			variant="chat"
			size="chat"
			value={input}
			onChangeText={setInput}
			multiline
			placeholder="Message..."
		/>
	);
}
