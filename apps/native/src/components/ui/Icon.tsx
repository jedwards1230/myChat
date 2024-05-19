import type { IconProps as baseProps } from "@expo/vector-icons/build/createIconSet";
import { useContext } from "react";
import { cn } from "@/lib/utils";
import * as IconProviders from "@expo/vector-icons";

import { TextClassContext } from "./Text";

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
			className={cn("text-foreground transition-colors", textClass, className)}
			{...props}
		/>
	);
}

// test types
//export const b = <Icon type="Ionicons" name="mnu" />;
