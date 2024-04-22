import { Pressable } from "react-native";

import { Agent, ToolName } from "@/types";
import { Text } from "@/components/ui/Text";
import { useState } from "react";
import { Textarea } from "@/components/ui/Textarea";

export function ToolOption({ agent, tool }: { agent: Agent; tool: ToolName }) {
    const [open, setOpen] = useState(false);
    const [focus, setFocus] = useState(false);
    return (
        <Pressable
            className="p-1.5 bg-background rounded hover:bg-foreground/5"
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
