import { View } from "react-native";
import { useState } from "react";

import type { AgentCreateSchema } from "@/types";
import { Text } from "@/components/ui/Text";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAgentPost } from "@/hooks/fetchers/Agent/useAgentPost";

const defaultAgent: AgentCreateSchema = {
    name: "",
    systemMessage: "",
    tools: [],
    toolsEnabled: true,
    model: {} as any,
};

export function AgentForm() {
    const [agent, setAgent] = useState<AgentCreateSchema>(defaultAgent);
    const { mutate } = useAgentPost();

    const handleChange = (props: Partial<AgentCreateSchema>) => {
        setAgent((prev) => ({ ...prev, ...props }));
    };

    const onSubmit = async () => {
        if (!agent.name) return console.error("Name is required");
        if (!agent.systemMessage) return console.error("System Message is required");

        mutate(agent);
    };

    return (
        <View className="flex flex-1 w-full gap-2 p-2 bg-background">
            <View>
                <Text>Name</Text>
                <Input
                    onChangeText={(e) => handleChange({ name: e })}
                    value={agent?.name}
                />
            </View>

            <View>
                <Text>System Message</Text>
                <Textarea
                    onChangeText={(e) => handleChange({ systemMessage: e })}
                    value={agent?.systemMessage}
                />
            </View>

            <Button onPress={onSubmit}>
                <Text>Save</Text>
            </Button>
        </View>
    );
}
