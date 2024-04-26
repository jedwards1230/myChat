import * as React from "react";
import { TextInput } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { useColorScheme } from "@/hooks/useColorScheme";
import { cn } from "@/lib/utils";

const DEFAULT_HEIGHT = 12;

const inputVariants = cva(
	"web:flex max-h-96 w-full rounded-md bg-background text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:focus-visible:outline-none",
	{
		variants: {
			variant: {
				default:
					"border px-3 py-2 border-input web:ring-offset-background web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
				chat: "pt-3 pl-16 pr-6 web:pr-8",
			},
			size: {
				default: "min-h-[80px] h-10 native:h-12",
				chat: "min-h-12 h-12 w-full",
			},
			editable: {
				false: "opacity-50 web:cursor-not-allowed",
				default: "",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			editable: "default",
		},
	}
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
		ref
	) => {
		const { colorScheme } = useColorScheme();
		const [height, setHeight] = React.useState(DEFAULT_HEIGHT);

		return (
			<TextInput
				ref={ref}
				className={cn(
					inputVariants({ variant, size, editable: props.editable }),
					className
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
	}
);

Textarea.displayName = "Textarea";

export { Textarea };
