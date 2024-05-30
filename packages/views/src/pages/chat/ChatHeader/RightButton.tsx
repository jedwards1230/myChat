import { View } from "react-native";
import { TextLink } from "solito/link";

import { OpenInNew } from "@mychat/ui/svg";
import { useConfigStore } from "@mychat/ui/uiStore";

export default function RightButton() {
	const { threadId } = useConfigStore();
	if (!threadId) return <View />;
	return (
		<TextLink
			aria-disabled={!threadId}
			className="absolute right-4 top-3 z-10"
			href="/(app)"
		>
			<OpenInNew />
		</TextLink>
	);
}
