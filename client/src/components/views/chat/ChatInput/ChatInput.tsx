import { useEffect, useRef } from "react";

import { Input } from "@/components/ui/Input";
import { useConfigStore } from "@/lib/stores/configStore";

export default function ChatInput({
	input,
	setInput,
}: {
	input: string;
	setInput: (input: string) => void;
	handleSubmit: () => void;
}) {
	const ref = useRef<any | null>(null);
	const threadId = useConfigStore((state) => state.threadId);

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
