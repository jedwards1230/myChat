import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Text as RNText } from "react-native";

import * as Slot from "@/components/primitives/slot";
import type { SlottableTextProps, TextRef } from "@/components/primitives/types";
import { cn } from "@/lib/utils";

const TextClassContext = React.createContext<string | undefined>(undefined);

const textVariants = cva("web:select-text", {
	variants: {
		variant: {
			default: "text-base text-foreground",
			raw: "",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

type TextProps = SlottableTextProps &
	VariantProps<typeof textVariants> & { skipContext?: boolean };

const Text = React.forwardRef<TextRef, TextProps>(
	({ className, variant, asChild = false, skipContext = false, ...props }, ref) => {
		const textClass = React.useContext(TextClassContext);
		const Component = asChild ? Slot.Text : RNText;

		return (
			<Component
				className={cn(
					textVariants({ variant, className }),
					!skipContext && textClass,
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Text.displayName = "Text";

export { Text, TextClassContext, textVariants };
export type { TextProps };
