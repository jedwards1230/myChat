import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";
import { ToolsOverview } from "./ToolsOverview";
import { Text } from "@/components/ui/Text";
import { Agent } from "@/types";
import { ToggleToolsSwitch } from "@/views/agent/helpers/ToggleTools";
import { View } from "react-native";

export function ToolDialog({
    agent,
    children,
    className,
    open,
    onClose,
}: {
    agent: Agent;
    children?: React.ReactNode;
    className?: string;
    open?: boolean;
    onClose?: () => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            {children && (
                <DialogTrigger asChild className={className}>
                    {children}
                </DialogTrigger>
            )}

            <DialogContent className="flex flex-col min-w-[80vw] md:min-w-[70vw] max-h-[90vh] overflow-y-scroll justify-start text-foreground">
                <DialogTitle className="text-center">
                    <Text className="relative">
                        Tools
                        <View className="absolute right-0 translate-x-full">
                            <ToggleToolsSwitch agent={agent} />
                        </View>
                    </Text>
                </DialogTitle>
                <DialogDescription className="flex flex-col gap-4">
                    <ToolsOverview agent={agent} />
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
}
