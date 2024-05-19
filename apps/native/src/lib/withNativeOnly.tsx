import { Platform, View } from "react-native";

export const withNativeOnly = <T extends React.PropsWithChildren<object>>(
	Component: React.ComponentType<T>,
) =>
	Platform.select({
		web: (props: T) => (
			<View className="flex-1" {...props}>
				{props.children}
			</View>
		),
		default: (props: T) => <Component {...props} />,
	});
