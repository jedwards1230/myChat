import { ScrollView } from "react-native";
import { remapProps } from "nativewind";

remapProps(ScrollView, {
	className: "style",
	contentContainerClassName: "contentContainerStyle",
});

export { ScrollView };
