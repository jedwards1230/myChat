import { Link } from "expo-router";
import { View } from "react-native";

import { MaterialIcons } from "@/components/ui/Icon";
import { useConfigStore } from "@/lib/stores/configStore";

export default function RightButton() {
	const threadId = useConfigStore((state) => state.threadId);

	if (!threadId) return <View />;
	return (
		<Link
			className="absolute top-0 z-10 md:top-3 right-4"
			disabled={!threadId}
			href="/(chat)"
		>
			<MaterialIcons
				name="open-in-new"
				size={24}
				className={threadId ? "text-foreground" : "text-secondary"}
			/>
		</Link>
	);
}
