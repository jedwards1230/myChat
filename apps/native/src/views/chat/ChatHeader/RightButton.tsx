import { View } from "react-native";
import { Link } from "expo-router";
import { Icon } from "@/components/ui/Icon";
import { useConfigStore } from "@/hooks/stores/configStore";

export default function RightButton() {
	const { threadId } = useConfigStore();
	if (!threadId) return <View />;
	return (
		<Link className="absolute right-4 top-3 z-10" disabled={!threadId} href="/(app)">
			<Icon type="MaterialIcons" name="open-in-new" size={24} />
		</Link>
	);
}
