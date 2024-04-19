import Drawer from "@/components/DrawerNav/Drawer";
import { useUser } from "@/hooks/useUser";
import { Redirect, useLocalSearchParams } from "expo-router";

export default function HomeLayout() {
    const params = useLocalSearchParams();
    const { loading, data } = useUser();

    if (loading) return null;
    if (!data?.session) return <Redirect href={{ pathname: "/(auth)", params }} />;
    return <Drawer />;
}

export { ErrorBoundary } from "expo-router";
