import { View } from "react-native";

import RightButton from "./RightButton";
import LeftButton from "./LeftButton";
import CenterButton from "./CenterButton";

export function ChatHeader() {
	return (
		<View className="relative flex flex-row items-center justify-center w-full h-12 px-2 py-2 border-b md:py-3 border-input">
			<LeftButton />
			<CenterButton />
			<RightButton />
		</View>
	);
}
