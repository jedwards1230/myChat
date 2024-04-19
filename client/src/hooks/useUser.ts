import { useUserQuery, useUserSessionQuery } from "./fetchers/User/useUserQuery";
import { useUserData } from "./stores/useUserData";
import Toast from "react-native-toast-message";
import { useIsRestoring } from "@tanstack/react-query";
import { useEffect } from "react";

export function useUser() {
    const { session, setSession, setUser } = useUserData();
    const loading = useIsRestoring();
    const userQuery = useUserQuery();
    const userSessionQuery = useUserSessionQuery();

    useEffect(() => {
        if (userQuery.isPending) return;
        if (userQuery.isError) {
            return Toast.show({
                type: "error",
                text1: "User Error",
                text2: "Failed to fetch user.",
            });
        }
        if (userQuery.data) {
            setUser(userQuery.data);
        }
    }, [userQuery.status]);

    useEffect(() => {
        if (userSessionQuery.isPending) return;
        if (userSessionQuery.isError) {
            return Toast.show({
                type: "error",
                text1: "Session Error",
                text2: "Failed to fetch user session.",
            });
        }
        if (userSessionQuery.data) {
            setSession(userSessionQuery.data);
        }
    }, [userSessionQuery.status]);

    if (!session) {
        return { error: "No session" };
    }

    if (userQuery.isError) {
        console.log("User Query Error", userQuery.error);
        return { error: userQuery.error };
    }

    if (userSessionQuery.isError) {
        console.log("User Session Query Error", userSessionQuery.error);
        return { error: userSessionQuery.error };
    }

    if (loading) return { loading: true } as const;

    if (!userQuery.data || !userSessionQuery.data) {
        return { loading: true } as const;
    }

    return { data: { user: userQuery.data, session: userSessionQuery.data } };
}
