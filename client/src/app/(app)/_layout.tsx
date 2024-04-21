import { Redirect } from "expo-router";

import Drawer from "@/components/DrawerNav/Drawer";
import { useUserData } from "@/hooks/stores/useUserData";

export default function HomeLayout() {
    const session = useUserData.use.session();

    if (!session) return <Redirect href={{ pathname: "/(auth)" }} />;
    return <Drawer />;
}

export { ErrorBoundary } from "expo-router";
