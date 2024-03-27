import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { AntDesign } from "@/components/ui/Icon";
import { Dropdown } from "./Dropdown";

export default function CenterButton() {
	return (
		<View className="flex items-start justify-center w-full">
			<Dropdown className="flex flex-row items-center w-auto gap-1 mx-auto md:ml-0">
				<Text
					numberOfLines={1}
					ellipsizeMode="tail"
					className="text-lg font-bold"
				>
					myChat
				</Text>
				<AntDesign name="down" size={12} className="text-foreground" />
			</Dropdown>
		</View>
	);
}
