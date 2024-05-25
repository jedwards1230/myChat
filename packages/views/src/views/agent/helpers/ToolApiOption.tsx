import { useState } from "react";
import { Pressable } from "react-native";

import type { Agent } from "@mychat/db/schema";

import { Text } from "~/native/Text";
import { Textarea } from "~/native/Textarea";

export function ToolOption({ tool }: { agent: Agent; tool: string }) {
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
