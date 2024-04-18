import { View } from "react-native";
import { useRef } from "react";

import type { Agent } from "@/types";
import { useAgentStore } from "@/hooks/stores/agentStore";

import { SystemMessage } from "./SystemMessage";
import { ModelSection, ModelStats, ToolSection } from "./helpers";

export function AgentView({ agent }: { agent: Agent }) {
	const ViewRef = useRef<HTMLElement>(null);
	const model = useAgentStore((state) => state.model);

	return (
		<View
			ref={ViewRef as unknown as React.RefObject<View>}
			className="flex w-full gap-4 p-2"
		>
			<SystemMessage agent={agent} />
			<ToolSection agent={agent} />
			<ModelSection model={model} container={ViewRef.current} />
			<ModelStats agent={agent} />
		</View>
	);
}
