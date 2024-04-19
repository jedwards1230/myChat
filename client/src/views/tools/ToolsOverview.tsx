import { useState } from "react";
import { View } from "react-native";

import { Agent, Tool } from "@/types";
import { ToolCard } from "./ToolCard";
import { ToolList } from "./ToolList";

export function ToolsOverview({ agent }: { agent: Agent }) {
    const [activeTool, setTool] = useState<Tool | null>(null);
    return (
        <>
            <View className="flex-1">
                <View className="flex flex-row flex-1 p-2 border rounded-lg border-input">
                    <ToolList agent={agent} setTool={setTool} activeTool={activeTool} />
                    <View className="flex-1 basis-3/4">
                        {activeTool && <ToolCard agent={agent} tool={activeTool} />}
                    </View>
                </View>
            </View>
        </>
    );
}
