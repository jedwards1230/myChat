import type {
	ComponentPropsWithAsChild,
	PressableRef,
	SlottablePressableProps,
} from "@/components/primitives/types";
import type { GestureResponderEvent } from "react-native";
import * as React from "react";
import { Pressable, View } from "react-native";
import { useAugmentedRef } from "@/components/primitives/hooks";
import * as Slot from "@/components/primitives/slot";
import * as Checkbox from "@radix-ui/react-checkbox";

import type { CheckboxIndicator, CheckboxRootProps } from "./types";

const CheckboxContext = React.createContext<CheckboxRootProps | null>(null);

const Root = React.forwardRef<PressableRef, SlottablePressableProps & CheckboxRootProps>(
	(
		{
			asChild,
			disabled,
			checked,
			onCheckedChange,
			onPress: onPressProp,
			role = "button",
			...props
		},
		ref,
	) => {
		const augmentedRef = useAugmentedRef({ ref });

		function onPress(ev: GestureResponderEvent) {
			onPressProp?.(ev);
			onCheckedChange(!checked);
		}

		React.useLayoutEffect(() => {
			if (augmentedRef.current) {
				const augRef = augmentedRef.current as unknown as HTMLButtonElement;
				augRef.dataset.state = checked ? "checked" : "unchecked";
				augRef.value = checked ? "on" : "off";
			}
		}, [checked]);

		React.useLayoutEffect(() => {
			if (augmentedRef.current) {
				const augRef = augmentedRef.current as unknown as HTMLButtonElement;
				augRef.type = "button";
				augRef.role = "checkbox";

				if (disabled) {
					augRef.dataset.disabled = "true";
				} else {
					augRef.dataset.disabled = undefined;
				}
			}
		}, [disabled]);

		const Component = asChild ? Slot.Pressable : Pressable;
		return (
			<CheckboxContext.Provider value={{ checked, disabled, onCheckedChange }}>
				<Checkbox.Root
					checked={checked}
					onCheckedChange={onCheckedChange}
					disabled={disabled}
					asChild
				>
					<Component
						ref={augmentedRef}
						role={role}
						onPress={onPress}
						disabled={disabled}
						{...props}
					/>
				</Checkbox.Root>
			</CheckboxContext.Provider>
		);
	},
);

Root.displayName = "RootWebCheckbox";

function useCheckboxContext() {
	const context = React.useContext(CheckboxContext);
	if (context === null) {
		throw new Error(
			"Checkbox compound components cannot be rendered outside the Checkbox component",
		);
	}
	return context;
}

const Indicator = React.forwardRef<
	React.ElementRef<typeof View>,
	ComponentPropsWithAsChild<typeof View> & CheckboxIndicator
>(({ asChild, forceMount, ...props }, ref) => {
	const { checked, disabled } = useCheckboxContext();
	const augmentedRef = useAugmentedRef({ ref });

	React.useLayoutEffect(() => {
		if (augmentedRef.current) {
			const augRef = augmentedRef.current as unknown as HTMLDivElement;
			augRef.dataset.state = checked ? "checked" : "unchecked";
		}
	}, [checked]);

	React.useLayoutEffect(() => {
		if (augmentedRef.current) {
			const augRef = augmentedRef.current as unknown as HTMLDivElement;
			if (disabled) {
				augRef.dataset.disabled = "true";
			} else {
				augRef.dataset.disabled = undefined;
			}
		}
	}, [disabled]);

	const Component = asChild ? Slot.View : View;
	return (
		<Checkbox.Indicator forceMount={forceMount} asChild>
			<Component ref={ref} {...props} />
		</Checkbox.Indicator>
	);
});

Indicator.displayName = "IndicatorWebCheckbox";

export { Indicator, Root };
