import { StyleSheet, View } from "react-native";

import RightButton from "./RightButton";
import LeftButton from "./LeftButton";
import CenterButton from "./CenterButton";

export function ChatHeader() {
	return (
		<View style={styles.container}>
			<LeftButton />
			<CenterButton />
			<RightButton />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: 60,
		position: "relative",
		paddingVertical: 10,
		paddingHorizontal: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
});
