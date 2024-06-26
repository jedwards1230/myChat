import { useTheme } from "@react-navigation/native";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Text, View } from "react-native";
import { cn } from "@/lib/utils";
import { Icon, type IconProps } from "@/components/ui/Icon";

const alertVariants = cva(
	"relative flex flex-row items-center bg-background w-full rounded-lg border border-border p-4 shadow shadow-foreground/10",
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
	}
);

const DefaultIconProps: IconProps = {
	type: "Entypo",
	name: "info",
	size: 20,
	className: "text-foreground/70",
};

const Alert = React.forwardRef<
	React.ElementRef<typeof View>,
	React.ComponentPropsWithoutRef<typeof View> &
		VariantProps<typeof alertVariants> & {
			iconProps?: IconProps;
		}
>(({ className, variant, children, iconProps = DefaultIconProps, ...props }, ref) => {
	const { colors } = useTheme();
	return (
		<View
			ref={ref}
			role="alert"
			className={alertVariants({ variant, className })}
			{...props}
		>
			<View className="">
				<Icon
					{...{ ...DefaultIconProps, ...iconProps }}
					color={variant === "destructive" ? colors.notification : colors.text}
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
			"pl-2 font-medium text-base tracking-tight text-foreground",
			className
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
