import { Link } from "expo-router";
import { View } from "react-native";

import { MaterialIcons } from "@/components/ui/Icon";
import { useConfigStore } from "@/lib/stores/configStore";

export default function RightButton() {
	const { threadId, setThreadId } = useConfigStore();

	if (!threadId) return <View />;
	return (
		<Link className="absolute z-10 top-3 right-4" disabled={!threadId} href="/(chat)">
			<MaterialIcons name="open-in-new" size={24} className="text-foreground" />
		</Link>
	);
}
