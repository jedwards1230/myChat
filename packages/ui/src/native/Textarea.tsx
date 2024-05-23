import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { TextInput } from "react-native";
import { cva } from "class-variance-authority";

import { useColorScheme } from "~/hooks/useColorScheme";
import { cn } from "~/utils";

const DEFAULT_HEIGHT = 12;

const inputVariants = cva(
	"web:flex native:text-lg native:leading-[1.25] web:focus-visible:outline-none max-h-96 w-full rounded-md bg-background text-base text-foreground placeholder:text-muted-foreground lg:text-sm",
	{
		variants: {
			variant: {
				default:
					"web:ring-offset-background web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 border border-input px-3 py-2",
				chat: "web:pr-8 pl-16 pr-6 pt-3",
			},
			size: {
				default: "native:h-12 h-10 min-h-[80px]",
				chat: "h-12 min-h-12 w-full",
			},
			editable: {
				false: "web:cursor-not-allowed opacity-50",
				default: "",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			editable: "default",
		},
	},
);

type TextareaProps = React.ComponentPropsWithoutRef<typeof TextInput> &
	VariantProps<typeof inputVariants> & {
		onSubmit?: () => void;
	};

const Textarea = React.forwardRef<React.ElementRef<typeof TextInput>, TextareaProps>(
	(
		{
			className,
			variant,
			size,
			multiline = true,
			placeholderClassName,
			onContentSizeChange,
			onKeyPress,
			onSubmit,
			...props
		},
		ref,
	) => {
		const { colorScheme } = useColorScheme();
		const [height, setHeight] = React.useState(DEFAULT_HEIGHT);

		return (
			<TextInput
				ref={ref}
				className={cn(
					inputVariants({ variant, size, editable: props.editable }),
					className,
				)}
				keyboardAppearance={colorScheme}
				placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
				multiline={multiline}
				onKeyPress={(e) => {
					if (
						onSubmit &&
						e.nativeEvent.key === "Enter" &&
						!(e.nativeEvent as any).shiftKey
					) {
						e.preventDefault();
						onSubmit();
						setHeight(DEFAULT_HEIGHT);
					}
					onKeyPress?.(e);
				}}
				onContentSizeChange={(e) => {
					setHeight(e.nativeEvent.contentSize.height);
					onContentSizeChange?.(e);
				}}
				style={{ height }}
				textAlignVertical="top"
				{...props}
			/>
		);
	},
);

Textarea.displayName = "Textarea";

export { Textarea };
