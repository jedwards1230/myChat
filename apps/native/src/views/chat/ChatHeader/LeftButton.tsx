import { Keyboard, Pressable } from "react-native";
import {
    type ParamListBase,
    useNavigation,
    DrawerActions,
} from "@react-navigation/native";
import { type DrawerNavigationProp } from "@react-navigation/drawer";

import { Icon } from "@/components/ui/Icon";

export default function LeftButton() {
    const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

    return (
        <Pressable
            className="absolute z-10 left-4 md:hidden"
            onPress={() => {
                navigation.dispatch(DrawerActions.toggleDrawer());
                Keyboard.dismiss();
            }}
        >
            <Icon type="Ionicons" name="menu-outline" size={24} />
        </Pressable>
    );
}
