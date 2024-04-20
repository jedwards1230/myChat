import { Redirect, useLocalSearchParams } from "expo-router";

import Drawer from "@/components/DrawerNav/Drawer";
import { useUserData } from "@/hooks/stores/useUserData";

export default function HomeLayout() {
    const params = useLocalSearchParams();
    const session = useUserData.use.session();

    if (!session) return <Redirect href={{ pathname: "/(auth)", params }} />;
    return <Drawer />;
}

export { ErrorBoundary } from "expo-router";
