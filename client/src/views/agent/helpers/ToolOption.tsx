import { Pressable } from "react-native";

import { Agent, Tool } from "@/types";
import { Text } from "@/components/ui/Text";
import { useState } from "react";

export function ToolOption({ agent, tool }: { agent: Agent; tool: Tool }) {
	const [open, setOpen] = useState(false);
	return (
		<Pressable
			className="p-1.5 bg-background rounded hover:bg-foreground/5"
			onPress={() => setOpen(!open)}
		>
			<Text>{tool}</Text>
		</Pressable>
	);
}
