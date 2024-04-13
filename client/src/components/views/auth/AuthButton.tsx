import { Pressable } from "react-native";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable>;

export const AuthButton = forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
	({ className, children, ...props }, ref) => {
		return (
			<Pressable
				className={cn(
					"min-w-full px-4 py-2 bg-foreground hover:bg-foreground/80",
					props.disabled && "opacity-50"
				)}
				ref={ref}
				role="button"
				{...props}
			>
				<Text className="font-bold text-center text-background">
					{children as string}
				</Text>
			</Pressable>
		);
	}
);
