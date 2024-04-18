import * as React from "react";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast, { ToastConfig } from "react-native-toast-message";
import { RootSiblingParent } from "react-native-root-siblings";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { IconProps } from "@/components/ui/Icon";

const SuccessIconProps: IconProps = {
	type: "AntDesign",
	name: "check",
};

const ErrorIconProps: IconProps = {
	type: "AntDesign",
	name: "closecircle",
};

const InfoIconProps: IconProps = {
	type: "AntDesign",
	name: "infocirlce",
};

/**
 * @docs https://github.com/calintamas/react-native-toast-message
 */
const TOAST_CONFIG: ToastConfig = {
	success: ({ text1, text2, onPress, props: { iconProps = SuccessIconProps } }) => (
		<Pressable onPress={onPress} className="w-full max-w-xl px-2">
			<Alert iconProps={iconProps} variant="success">
				<AlertTitle>{text1}</AlertTitle>
				<AlertDescription>{text2}</AlertDescription>
			</Alert>
		</Pressable>
	),
	error: ({ text1, text2, onPress, props: { iconProps = ErrorIconProps } }) => (
		<Pressable onPress={onPress} className="w-full max-w-xl px-2">
			<Alert iconProps={iconProps} variant="destructive">
				<AlertTitle>{text1}</AlertTitle>
				<AlertDescription>{text2}</AlertDescription>
			</Alert>
		</Pressable>
	),
	base: ({ text1, text2, onPress, props: { iconProps = InfoIconProps } }) => (
		<Pressable onPress={onPress} className="w-full max-w-xl px-2">
			<Alert iconProps={iconProps} variant="default">
				<AlertTitle>{text1}</AlertTitle>
				<AlertDescription>{text2}</AlertDescription>
			</Alert>
		</Pressable>
	),
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const insets = useSafeAreaInsets();
	return (
		<RootSiblingParent>
			{children}
			<Toast
				config={TOAST_CONFIG}
				topOffset={insets.top + 10}
				bottomOffset={insets.bottom}
			/>
		</RootSiblingParent>
	);
}
