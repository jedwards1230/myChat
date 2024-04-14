import * as React from "react";
import { TextInput } from "react-native";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
	React.ElementRef<typeof TextInput>,
	React.ComponentPropsWithoutRef<typeof TextInput>
>(
	(
		{
			className,
			multiline = true,
			numberOfLines = 4,
			placeholderClassName,
			...props
		},
		ref
	) => {
		const [height, setHeight] = React.useState(0);

		return (
			<TextInput
				ref={ref}
				className={cn(
					"web:flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground web:ring-offset-background placeholder:text-muted-foreground web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
					props.editable === false && "opacity-50 web:cursor-not-allowed",
					className
				)}
				placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
				multiline={multiline}
				onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height)}
				//numberOfLines={numberOfLines}
				style={{ height }}
				textAlignVertical="top"
				{...props}
			/>
		);
	}
);

Textarea.displayName = "Textarea";

export { Textarea };
