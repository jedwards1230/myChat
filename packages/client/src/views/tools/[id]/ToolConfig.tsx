import { View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Picker } from "@react-native-picker/picker";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { Text } from "@/components/ui/Text";
import { useToolsSuspenseQuery } from "@/hooks/fetchers/AgentTool/useAgentToolQuery";
import { ToolForm } from "./ToolForm";
import type { ToolName } from "@/types";

type SelectOption = {
	label: string;
	value: ToolName;
};

export function ToolConfig({ id }: { id?: string }) {
	console.log("ToolConfig", id);
	const [selected, setSelected] = useState<SelectOption | undefined>();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const { data, isError } = useToolsSuspenseQuery();
	const ref = useRef(null);

	if (isError) return <Text>Error loading tools</Text>;
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
	const { data, isError } = useToolsSuspenseQuery();

	if (isError) return <Text>Error loading tools</Text>;
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
