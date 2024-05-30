import { Keyboard, Pressable } from "react-native";

import { Bars } from "@mychat/ui/svg";

import { useDrawer } from "../../../components/Drawer";

export default function LeftButton() {
	const { toggle } = useDrawer();

	return (
		<Pressable
			className="absolute left-4 z-10 md:hidden"
			onPress={() => {
				toggle();
				Keyboard.dismiss();
			}}
		>
			<Bars />
		</Pressable>
	);
}
