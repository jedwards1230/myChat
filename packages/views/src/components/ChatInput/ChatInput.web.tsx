import type { ChatInputProps } from "./types";
import { Textarea } from "../../../../ui/src/native/Textarea";

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
