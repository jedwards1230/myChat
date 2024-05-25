import type { ChatInputProps } from "./types";
import { Input } from "../../../../ui/src/native/Input";

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
