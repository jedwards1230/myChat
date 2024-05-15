import * as IconProviders from "@expo/vector-icons";
import type { IconProps as baseProps } from "@expo/vector-icons/build/createIconSet";
import { useContext } from "react";

import { TextClassContext } from "./Text";
import { cn } from "@/lib/utils";

type IconProviders = typeof IconProviders;
type IconType = keyof IconProviders;

// Discriminated Union Type
type IconComponentType = {
	[K in IconType]: { type: K; name: keyof IconProviders[K]["glyphMap"] };
}[IconType];

export type IconProps = IconComponentType & baseProps<string>;

/**
 * Handles \@expo/vector-icons
 * @param type - Icon provider type
 * @param name - Icon name
 * @param props - Icon props
 * */
export function Icon({ type, name, className, size = 20, ...props }: IconProps) {
	const IconProvider = IconProviders[type];
	const textClass = useContext(TextClassContext);
	return (
		<IconProvider
			name={name}
			size={size}
			className={cn("transition-colors text-foreground", textClass, className)}
			{...props}
		/>
	);
}

// test types
//export const b = <Icon type="Ionicons" name="mnu" />;
