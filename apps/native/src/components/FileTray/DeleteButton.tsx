import { Pressable } from "react-native";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { useFileStore } from "@/hooks/stores/fileStore";
import { useHoverHelper } from "@/hooks/useHoverHelper";
import type { FileInformation } from "@/hooks/useFileInformation";

export function RemoveFileButton({ file }: { file: FileInformation }) {
    const removeFile = useFileStore((state) => state.removeFile);
    const { isHover, ...helpers } = useHoverHelper();
    return (
        <Pressable
            {...helpers}
            onPress={(e) => {
                e.stopPropagation();
                removeFile(file);
            }}
            className={cn(
                "absolute z-10 flex items-center justify-center w-4 h-4 rounded-full -top-2 -right-2 group",
                !isHover ? "bg-background" : "bg-foreground/20"
            )}
        >
            <Icon
                type="MaterialIcons"
                name="close"
                size={16}
                className={!isHover ? "text-foreground/60" : "text-foreground"}
            />
        </Pressable>
    );
}

export function RemoveFolderButton({ files }: { files: FileInformation[] }) {
    const removeFiles = useFileStore((state) => state.removeFiles);
    const { isHover, ...helpers } = useHoverHelper();

    return (
        <Pressable
            {...helpers}
            onPress={(e) => {
                e.stopPropagation();
                removeFiles(files);
            }}
            className={cn(
                "absolute z-10 flex items-center justify-center w-4 h-4 rounded-full -top-2 -right-2",
                !isHover ? "bg-background" : "bg-foreground/20"
            )}
        >
            <Icon
                type="MaterialIcons"
                name="close"
                size={16}
                className={!isHover ? "text-foreground/60" : "text-foreground"}
            />
        </Pressable>
    );
}
