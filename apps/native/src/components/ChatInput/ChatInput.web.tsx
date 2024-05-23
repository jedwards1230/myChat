import { Textarea } from "@mychat/ui/native/Textarea";

import type { ChatInputProps } from "./types";

export default function ChatInput({ input, setInput, handleSubmit }: ChatInputProps) {
	return (
		<Textarea
			variant={"chat"}
			size={"chat"}
			value={input}
			placeholder="Message..."
			onChangeText={setInput}
			onSubmit={handleSubmit}
			multiline
		/>
	);
}
