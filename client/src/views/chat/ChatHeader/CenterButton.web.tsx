import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { AntDesign } from "@/components/ui/Icon";
import { Dropdown } from "./Dropdown";

export default function CenterButton() {
	return (
		<View className="flex items-center justify-center w-full md:items-start">
			<Dropdown className="flex flex-row items-center w-auto gap-2 px-2 py-1.5 mx-auto rounded-lg hover:bg-foreground/10 md:ml-2">
				<Text
					numberOfLines={1}
					ellipsizeMode="tail"
					className="text-lg font-bold"
				>
					myChat
				</Text>
				<AntDesign name="down" size={12} className="text-secondary-foreground" />
			</Dropdown>
		</View>
	);
}