import { useEffect } from "react";
import * as Haptics from "expo-haptics";

import { withNativeOnly } from "@/components/withNativeOnly";

function HapticsProvider({ children }: { children: React.ReactNode }) {
	const isDrawerOpen = false;

	useEffect(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
	}, [isDrawerOpen]);

	return children;
}

const NativeHapticsProvider = withNativeOnly(HapticsProvider);

export default NativeHapticsProvider;
