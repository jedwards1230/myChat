import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { ActionList } from "@/hooks/actions";

export function CommandTray({ input }: { input: string }) {
    if (!input.startsWith("/")) return null;
    return (
        <View className="flex flex-row items-center justify-between w-full py-2 pl-2 pr-2 web:pr-10">
            <CommandList input={input} />
        </View>
    );
}

function CommandList({ input }: { input: string }) {
    const command = input.slice(1);
    const possibleCommands = command
        ? ActionList.filter((c) => c.startsWith(command))
        : ActionList;

    return (
        <View>
            {possibleCommands.map((command) => (
                <CommandItem key={command} command={command} />
            ))}
        </View>
    );
}

function CommandItem({ command }: { command: string }) {
    return <Text>{command}</Text>;
}
