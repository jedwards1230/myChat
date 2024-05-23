import type { Agent, ToolName } from "@/types";
import { useState } from "react";
import { Pressable } from "react-native";

import { Text } from "@mychat/ui/native/Text";
import { Textarea } from "@mychat/ui/native/Textarea";

export function ToolOption({ tool }: { agent: Agent; tool: ToolName }) {
	const [open, setOpen] = useState(false);
	const [focus, setFocus] = useState(false);
	return (
		<Pressable
			className="rounded bg-background p-1.5 hover:bg-foreground/5"
			onPress={!focus ? () => setOpen(!open) : undefined}
		>
			<Text>{tool}</Text>
			{open && (
				<Textarea
					onFocus={() => setFocus(true)}
					onBlur={() => setFocus(false)}
					onStartShouldSetResponder={() => true}
				/>
			)}
		</Pressable>
	);
}
