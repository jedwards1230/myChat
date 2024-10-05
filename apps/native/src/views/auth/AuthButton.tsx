import { forwardRef } from "react";
import { Pressable } from "react-native";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable>;

export const AuthButton = forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
	({ className, children, ...props }, ref) => {
		return (
			<Pressable
				className={cn(
					"min-w-full bg-foreground px-4 py-2 hover:bg-foreground/80",
					props.disabled && "opacity-50",
					className,
				)}
				ref={ref}
				role="button"
				{...props}
			>
				<Text className="text-center font-bold text-background">
					{children as string}
				</Text>
			</Pressable>
		);
	},
);
