import { remapProps } from "nativewind";
import { ScrollView } from "react-native";

remapProps(ScrollView, {
	className: "style",
	contentContainerClassName: "contentContainerStyle",
});

export { ScrollView };
