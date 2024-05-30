import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import type { ToolName } from "@mychat/db/schema/tools";
import { api } from "@mychat/api/client/react-query";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@mychat/ui/native/Select";
import { Text } from "@mychat/ui/native/Text";

import { ToolForm } from "./ToolForm";

interface SelectOption {
	label: string;
	value: ToolName;
}

export function ToolConfig({ id }: { id?: string }) {
	console.log("ToolConfig", id);
	const [selected, setSelected] = useState<SelectOption | undefined>();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const [data, query] = api.agent.getTools.useSuspenseQuery();
	const ref = useRef(null);

	if (query.isError) return <Text>Error loading tools</Text>;
	return (
		<View className="flex-1" ref={ref}>
			{mounted && (
				<>
					<Select
						onValueChange={(value) => setSelected(value as SelectOption)}
						value={selected}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a tool" />
						</SelectTrigger>
						<SelectContent container={ref.current}>
							{data.map((model, i) => (
								<SelectItem key={i} label={model} value={model} />
							))}
						</SelectContent>
					</Select>
					{selected && <ToolForm tool={selected.value} />}
				</>
			)}
		</View>
	);
}

export function ToolConfigNative() {
	const [data, query] = api.agent.getTools.useSuspenseQuery();

	if (query.isError) return <Text>Error loading tools</Text>;
	return (
		<View>
			<Text>Dialog Body</Text>
			<Picker
			///selectedValue={selectedLanguage}
			//onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
			>
				{data.map((model, i) => (
					<Picker.Item key={i} label={model} value={model} />
				))}
			</Picker>
		</View>
	);
}
