// override react-native types with react-native-web types
import "react-native";

import type { AccessibilityRole } from "react-native-web";

declare module "react-native" {
	interface PressableStateCallbackType {
		hovered?: boolean;
		focused?: boolean;
	}
	interface ViewStyle {
		transitionProperty?: string;
		transitionDuration?: string;
	}
	interface TextProps {
		accessibilityComponentType?: never;
		accessibilityTraits?: never;
		href?: string;
		hrefAttrs?: {
			rel: "noreferrer";
			target?: "_blank";
		};
	}
	interface ViewProps {
		accessibilityRole?: AccessibilityRole;
		href?: string;
		hrefAttrs?: {
			rel: "noreferrer";
			target?: "_blank";
		};
		onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
	}
}
