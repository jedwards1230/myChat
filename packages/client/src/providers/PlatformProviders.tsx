import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import NativeHapticsProvider from "@/providers/HapticsProvider";

export function PlatformProviders(props: { children: React.ReactNode }) {
	return (
		<GestureHandlerRootView className="flex-1">
			<NativeHapticsProvider>{props.children}</NativeHapticsProvider>
		</GestureHandlerRootView>
	);
}
