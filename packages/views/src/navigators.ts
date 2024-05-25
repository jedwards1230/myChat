import { withLayoutContext } from "expo-router";
import { createDrawerNavigator } from "@react-navigation/drawer";

export const Drawer = withLayoutContext(createDrawerNavigator().Navigator);
