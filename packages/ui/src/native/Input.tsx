import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { TextInput } from "react-native";
import { cva } from "class-variance-authority";

import { useColorScheme } from "../hooks/useColorScheme";
import { cn } from "../utils";

const inputVariants = cva(
	"web:flex web:w-full native:text-lg native:leading-[1.25] web:ring-offset-background web:focus-visible:outline-none border-input bg-background text-base text-foreground file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground lg:text-sm",
	{
		variants: {
			variant: {
				default:
					"web:py-2 web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 rounded-md border px-3 opacity-50",
				chat: "web:pr-8 pr-6 pt-3",
			},
			size: {
				default: "native:h-12 h-10",
				chat: "h-12 min-h-12 w-full",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

type InputProps = React.ComponentPropsWithoutRef<typeof TextInput> &
	VariantProps<typeof inputVariants>;

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
	({ className, placeholderClassName, variant, size, ...props }, ref) => {
		const { colorScheme } = useColorScheme();
		return (
			<TextInput
				ref={ref}
				keyboardAppearance={colorScheme}
				className={cn(inputVariants({ variant, size }), className)}
				placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
				{...props}
			/>
		);
	},
);

Input.displayName = "Input";

export { Input, inputVariants };
export type { InputProps };
