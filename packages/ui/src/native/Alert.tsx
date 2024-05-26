import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { cva } from "class-variance-authority";

import { Info } from "../svg";
import { cn } from "../utils";

const alertVariants = cva(
	"relative flex w-full flex-row items-center rounded-lg border border-border bg-background p-4 shadow shadow-foreground/10",
	{
		variants: {
			variant: {
				default: "",
				destructive: "border-destructive",
				success: "border-success",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const Alert = React.forwardRef<
	React.ElementRef<typeof View>,
	React.ComponentPropsWithoutRef<typeof View> & VariantProps<typeof alertVariants>
>(({ className, variant, children, ...props }, ref) => {
	const { colors } = useTheme();
	return (
		<View
			ref={ref}
			role="alert"
			className={alertVariants({ variant, className })}
			{...props}
		>
			<View className="">
				<Info
					color={variant === "destructive" ? colors.notification : colors.text}
					className="text-foreground/70"
				/>
			</View>
			{children}
		</View>
	);
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
	React.ElementRef<typeof Text>,
	React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => (
	<Text
		ref={ref}
		className={cn(
			"pl-2 text-base font-medium tracking-tight text-foreground",
			className,
		)}
		{...props}
	/>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
	React.ElementRef<typeof Text>,
	React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => (
	<Text
		ref={ref}
		className={cn("pl-2 text-sm text-foreground", className)}
		{...props}
	/>
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle };
