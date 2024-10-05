import type { NativeStackHeaderProps } from "@react-navigation/native-stack";

import RightButton from "./RightButton";
import LeftButton from "./LeftButton";
import { CenterButton } from "./CenterButton";
import { HeaderWrapper } from "@/views/HeaderWrapper";

export type ChatHeaderProps = NativeStackHeaderProps & {
    threadId: string | null;
};

export function ChatHeader({ threadId }: ChatHeaderProps) {
    return (
        <HeaderWrapper>
            <LeftButton />
            <CenterButton threadId={threadId} />
            <RightButton />
        </HeaderWrapper>
    );
}
