import { View } from "react-native";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { Text } from "@/components/ui/Text";
import { useToolsQuery } from "@/hooks/fetchers/AgentTool/useAgentToolQuery";
import { useRef } from "react";

export function ToolConfig() {
    const { data, isPending, isError } = useToolsQuery();
    const container = useRef(null);

    if (isError) return <Text>Error loading tools</Text>;
    if (isPending) return <Text>Loading...</Text>;
    return (
        <View ref={container}>
            <Text>Dialog Body</Text>
            <Select
            //onValueChange={updateModel}
            //value={{ value: model.name, label: model.name }}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent container={container.current}>
                    {data.map((model, i) => (
                        <SelectItem key={i} label={model.name} value={model.name}>
                            Model: {model.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </View>
    );
}
