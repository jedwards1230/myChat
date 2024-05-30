import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Pressable } from "react-native";
import { cva } from "class-variance-authority";

import { cn } from "../utils";
import { TextClassContext } from "./Text";

const buttonVariants = cva(
	"group flex items-center justify-center rounded-md web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
	{
		variants: {
			variant: {
				default: "bg-primary active:opacity-90 web:hover:opacity-90",
				destructive: "bg-destructive active:opacity-90 web:hover:opacity-90",
				outline:
					"border border-input bg-background active:bg-accent web:hover:bg-accent web:hover:text-accent-foreground",
				secondary: "bg-secondary active:opacity-80 web:hover:opacity-80",
				ghost: "active:bg-accent web:hover:bg-accent web:hover:text-accent-foreground",
				link: "web:underline-offset-4 web:hover:underline web:focus:underline ",
				navItem:
					"flex w-full flex-row items-center justify-between gap-2 bg-secondary hover:bg-secondary-foreground/10 active:opacity-90 web:justify-start dark:hover:bg-secondary-foreground/50",
			},
			size: {
				default: "native:h-12 native:px-5 native:py-3 h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "native:h-14 h-11 rounded-md px-8",
				icon: "h-10 w-10",
				navItem: "h-10 p-2",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const buttonTextVariants = cva(
	"native:text-base text-sm text-foreground web:whitespace-nowrap web:transition-colors",
	{
		variants: {
			variant: {
				default: "font-medium text-primary-foreground",
				destructive: "font-medium text-destructive-foreground",
				outline: "font-medium group-active:text-accent-foreground",
				secondary:
					"font-medium text-secondary-foreground group-active:text-secondary-foreground",
				ghost: "font-medium group-active:text-accent-foreground",
				link: "font-medium text-primary group-active:underline",
				navItem: "text-secondary-foreground active:bg-primary",
			},
			size: {
				default: "",
				sm: "",
				lg: "native:text-lg",
				icon: "",
				navItem: "",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
	VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
	({ className, variant, size, ...props }, ref) => {
		return (
			<TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
				<Pressable
					className={cn(
						props.disabled && "opacity-50",
						buttonVariants({ variant, size, className }),
					)}
					ref={ref}
					role="button"
					{...props}
				/>
			</TextClassContext.Provider>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
