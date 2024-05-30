"use client";

import type { NativeStackHeaderProps } from "@react-navigation/native-stack";

import { HeaderWrapper } from "../../HeaderWrapper";
import { CenterButton } from "./CenterButton";
import LeftButton from "./LeftButton";
import RightButton from "./RightButton";

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
