import type { Agent } from "@/types";
import { useRef } from "react";
import { View } from "react-native";

import { ModelSection, ModelStats, ToolSection } from "./helpers";
import { SystemMessage } from "./helpers/SystemMessage";

export function AgentView({ agent }: { agent: Agent }) {
	const ViewRef = useRef(null);

	return (
		<View ref={ViewRef} className="flex w-full gap-4 p-2">
			<SystemMessage agent={agent} />
			<ToolSection agent={agent} />
			<ModelSection agent={agent} container={ViewRef.current} />
			<ModelStats agent={agent} />
		</View>
	);
}