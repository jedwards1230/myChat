import { Redirect, useLocalSearchParams } from "expo-router";

import Drawer from "@/components/DrawerNav/Drawer";
import { useUser } from "@/hooks/useUser";

export default function HomeLayout() {
    const params = useLocalSearchParams();
    const { loading, data: session } = useUser();

    if (loading) return null;
    if (!session) return <Redirect href={{ pathname: "/(auth)", params }} />;
    return <Drawer />;
}

export { ErrorBoundary } from "expo-router";
