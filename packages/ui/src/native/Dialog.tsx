//import { X } from "@/components/Icons";
import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { useColorScheme } from "../hooks/useColorScheme";
import { DialogPrimitive } from "../primitives";
import { cn } from "../utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlayWeb = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
	const { open } = DialogPrimitive.useRootContext();
	return (
		<DialogPrimitive.Overlay
			style={StyleSheet.absoluteFill}
			className={cn(
				"z-50 flex items-center justify-center bg-black/80 p-2",
				open ? "web:animate-in web:fade-in-0" : "web:animate-out web:fade-out-0",
				className,
			)}
			{...props}
			ref={ref}
		/>
	);
});

DialogOverlayWeb.displayName = "DialogOverlayWeb";

const DialogOverlayNative = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, children, ...props }, ref) => {
	return (
		<DialogPrimitive.Overlay
			style={StyleSheet.absoluteFill}
			className={cn(
				"z-50 flex items-center justify-center bg-black/80 p-2",
				className,
			)}
			{...props}
			ref={ref}
		>
			<Animated.View
				entering={FadeIn.duration(150)}
				exiting={FadeOut.duration(150)}
			>
				<>{children}</>
			</Animated.View>
		</DialogPrimitive.Overlay>
	);
});

DialogOverlayNative.displayName = "DialogOverlayNative";

const DialogOverlay = Platform.select({
	web: DialogOverlayWeb,
	default: DialogOverlayNative,
});

const DialogContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
	const { open } = DialogPrimitive.useRootContext();
	const { themeStyles } = useColorScheme();
	return (
		<DialogPortal>
			<DialogOverlay>
				<DialogPrimitive.Content
					ref={ref}
					style={themeStyles}
					className={cn(
						"z-50 flex max-h-[90vh] min-w-[60vw] max-w-lg flex-col justify-start gap-4 overflow-y-scroll rounded-lg border border-border bg-background p-6 shadow-lg web:cursor-default web:duration-200",
						open
							? "web:animate-in web:fade-in-0 web:zoom-in-95"
							: "web:animate-out web:fade-out-0 web:zoom-out-95",
						className,
					)}
					{...props}
				>
					{children}
				</DialogPrimitive.Content>
			</DialogOverlay>
		</DialogPortal>
	);
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof View>) => (
	<View
		className={cn("flex flex-col gap-1.5 text-center sm:text-left", className)}
		{...props}
	/>
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof View>) => (
	<View
		className={cn(
			"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
			className,
		)}
		{...props}
	/>
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn(
			"native:text-xl text-lg font-semibold leading-none tracking-tight text-foreground",
			className,
		)}
		{...props}
	/>
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description
		ref={ref}
		className={cn("native:text-base text-sm text-muted-foreground", className)}
		{...props}
	/>
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
