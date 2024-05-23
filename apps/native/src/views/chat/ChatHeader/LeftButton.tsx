import type { ParamListBase } from "@react-navigation/native";
import { Keyboard, Pressable } from "react-native";
import { type DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerActions, useNavigation } from "@react-navigation/native";

import { Icon } from "@mychat/ui/native/Icon";

export default function LeftButton() {
	const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

	return (
		<Pressable
			className="absolute left-4 z-10 md:hidden"
			onPress={() => {
				navigation.dispatch(DrawerActions.toggleDrawer());
				Keyboard.dismiss();
			}}
		>
			<Icon type="Ionicons" name="menu-outline" size={24} />
		</Pressable>
	);
}
