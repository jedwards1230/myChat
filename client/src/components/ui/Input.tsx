import * as React from "react";
import { TextInput } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useColorScheme } from "@/hooks/useColorScheme";

const inputVariants = cva(
	"web:flex web:w-full border-input bg-background text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:font-medium web:focus-visible:outline-none",
	{
		variants: {
			variant: {
				default:
					"border rounded-md px-3 web:py-2 opacity-50 web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
				chat: "pt-3 pr-6 web:pr-8",
			},
			size: {
				default: "h-10 native:h-12",
				chat: "min-h-12 h-12 w-full",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

type InputProps = React.ComponentPropsWithoutRef<typeof TextInput> &
	VariantProps<typeof inputVariants> & {
		boxShadow?: never;
	};

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
	({ className, placeholderClassName, variant, size, boxShadow, ...props }, ref) => {
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
	}
);

Input.displayName = "Input";

export { Input, inputVariants };
export type { InputProps };
