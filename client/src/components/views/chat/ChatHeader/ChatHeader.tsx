import { View } from "react-native";

import RightButton from "./RightButton";
import LeftButton from "./LeftButton";
import CenterButton from "./CenterButton";

export function ChatHeader() {
	return (
		<View className="relative flex flex-row items-center justify-center w-full h-16 p-2">
			<LeftButton />
			<CenterButton />
			<RightButton />
		</View>
	);
}
