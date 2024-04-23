import { cssInterop } from "nativewind";
import {
    AntDesign,
    EvilIcons,
    Entypo,
    Feather,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
    SimpleLineIcons,
    Zocial,
} from "@expo/vector-icons";
import { IconProps as baseProps } from "@expo/vector-icons/build/createIconSet";
import { useContext } from "react";

import { TextClassContext } from "./Text";
import { cn } from "@/lib/utils";

const IconProviders = {
    AntDesign,
    EvilIcons,
    Entypo,
    Feather,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
    SimpleLineIcons,
    Zocial,
} as const;
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
export function Icon({ type, name, className, ...props }: IconProps) {
    const IconProvider = IconProviders[type];
    const textClass = useContext(TextClassContext);
    return (
        <IconProvider
            name={name}
            className={cn("transition-colors text-foreground", textClass, className)}
            {...props}
        />
    );
}

Object.values(IconProviders).forEach((provider) => {
    cssInterop(provider, {
        className: {
            target: "style",
            nativeStyleToProp: {
                color: true,
            },
        },
    });
});

// test types
//export const b = <Icon type="Ionicons" name="mnu" />;
