import * as React from "react";
import { Pressable, Text as RNText } from "react-native";

import type { LabelRootProps, LabelTextProps } from "./types";
import type {
	PressableRef,
	SlottablePressableProps,
	SlottableTextProps,
	TextRef,
} from "~/primitives/types";
import * as Slot from "~/primitives/slot";

const Root = React.forwardRef<
	PressableRef,
	Omit<SlottablePressableProps, "children" | "hitSlop" | "style"> & LabelRootProps
>(({ asChild, ...props }, ref) => {
	const Component = asChild ? Slot.Pressable : Pressable;
	return <Component ref={ref} {...props} />;
});

Root.displayName = "RootNativeLabel";

const Text = React.forwardRef<TextRef, SlottableTextProps & LabelTextProps>(
	({ asChild, ...props }, ref) => {
		const Component = asChild ? Slot.Text : RNText;
		return <Component ref={ref} {...props} />;
	},
);

Text.displayName = "TextNativeLabel";

export { Root, Text };
