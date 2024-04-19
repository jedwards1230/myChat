import { View } from "react-native";
import { useRef } from "react";

import type { Agent } from "@/types";
import { SystemMessage } from "./helpers/SystemMessage";
import { ModelSection, ModelStats, ToolSection } from "./helpers";

export function AgentView({ agent }: { agent: Agent }) {
	const ViewRef = useRef<HTMLElement>(null);

	return (
		<View
			ref={ViewRef as unknown as React.RefObject<View>}
			className="flex w-full gap-4 p-2"
		>
			<SystemMessage agent={agent} />
			<ToolSection agent={agent} />
			<ModelSection agent={agent} container={ViewRef.current} />
			<ModelStats agent={agent} />
		</View>
	);
}
