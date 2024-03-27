import { RowItem } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { useConfigStore } from "@/lib/stores/configStore";
import { useEffect, useState } from "react";

export function HostConfig() {
	const hostStore = useConfigStore();
	const [input, setInput] = useState(hostStore.host);
	useEffect(() => setInput(hostStore.host), [hostStore.host]);

	return (
		<RowItem>
			<Text>Host</Text>
			<Input
				onChangeText={setInput}
				onEndEditing={() => hostStore.setHost(input)}
				inputMode="url"
				selectTextOnFocus
				numberOfLines={1}
				className="w-2/3 text-right border-0 bg-form web:focus-visible:ring-0"
				value={input}
			/>
		</RowItem>
	);
}
