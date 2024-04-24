import RightButton from "./RightButton";
import LeftButton from "./LeftButton";
import { CenterButton } from "./CenterButton";
import { HeaderWrapper } from "@/views/HeaderWrapper";

export function ChatHeader({ threadId }: { threadId: string | null }) {
    return (
        <HeaderWrapper>
            <LeftButton />
            <CenterButton threadId={threadId} />
            <RightButton />
        </HeaderWrapper>
    );
}
