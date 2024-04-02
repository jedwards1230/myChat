import { View } from "react-native";

import RightButton from "./RightButton";
import LeftButton from "./LeftButton";
import CenterButton from "./CenterButton";

export function ChatHeader() {
	return (
		<View className="relative flex flex-row items-center justify-center w-full h-12 p-2 border-b border-input">
			<LeftButton />
			<CenterButton />
			<RightButton />
		</View>
	);
}
