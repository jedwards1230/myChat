import { useUserQuery, useUserSessionQuery } from "./fetchers/User/useUserQuery";
import { useUserData } from "./stores/useUserData";
import Toast from "react-native-toast-message";
import { useIsRestoring } from "@tanstack/react-query";
import { useEffect } from "react";
import { isFetchError } from "@/lib/fetcher";

export function useUser() {
    const { session, setSession, setUser } = useUserData();
    const loading = useIsRestoring();
    const userQuery = useUserQuery();
    const userSessionQuery = useUserSessionQuery();

    useEffect(() => {
        if (userQuery.isPending) return;
        if (userQuery.isError) {
            if (isFetchError(userQuery.error)) {
                if (userQuery.error.status === 401) {
                    setUser(null);
                    setSession(null);
                    return Toast.show({
                        type: "error",
                        text1: "User Error",
                        text2: "Unauthorized.",
                    });
                }
            }
            return Toast.show({
                type: "error",
                text1: "User Error",
                text2: userQuery.error.message,
            });
        }
        if (userQuery.data) {
            setUser(userQuery.data);
        }
    }, [userQuery.status]);

    useEffect(() => {
        if (userSessionQuery.isPending) return;
        if (userSessionQuery.isError) {
            if (isFetchError(userQuery.error)) {
                if (userQuery.error.status === 401) {
                    setSession(null);
                    return Toast.show({
                        type: "error",
                        text1: "User Error",
                        text2: "Unauthorized.",
                    });
                }
            }
            return Toast.show({
                type: "error",
                text1: "Session Error",
                text2: userSessionQuery.error.message,
            });
        }
        if (userSessionQuery.data) {
            setSession(userSessionQuery.data);
        }
    }, [userSessionQuery.status]);

    if (!session) {
        return { error: "No session" };
    }

    if (loading) return { loading: true } as const;

    if (userQuery.isError) {
        return { error: userQuery.error };
    }

    if (userSessionQuery.isError) {
        return { error: userSessionQuery.error };
    }

    if (!userQuery.data || !userSessionQuery.data) {
        return { loading: true } as const;
    }

    return { data: { user: userQuery.data, session: userSessionQuery.data } };
}
