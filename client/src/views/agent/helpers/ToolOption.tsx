import { Agent } from "@/types";
import { RowItem } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";

export function ToolOption({ agent, tool }: { agent: Agent; tool: string }) {
	return (
		<RowItem key={tool}>
			<Text>{tool}</Text>
		</RowItem>
	);
}
