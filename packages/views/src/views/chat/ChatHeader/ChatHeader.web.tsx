"use client";

import { HeaderWrapper } from "../../HeaderWrapper";
import { CenterButton } from "./CenterButton";
import LeftButton from "./LeftButton";
import RightButton from "./RightButton";

export interface ChatHeaderProps {
	threadId: string | null;
}

export function ChatHeader({ threadId }: ChatHeaderProps) {
	return (
		<HeaderWrapper>
			<LeftButton />
			<CenterButton threadId={threadId} />
			<RightButton />
		</HeaderWrapper>
	);
}
