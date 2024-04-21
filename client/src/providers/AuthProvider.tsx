import Toast from "react-native-toast-message";
import { useIsRestoring } from "@tanstack/react-query";
import { useEffect } from "react";

import { isFetchError } from "@/lib/fetcher";
import { useUserQuery, useUserSessionQuery } from "@/hooks/fetchers/User/useUserQuery";
import { useUserData } from "@/hooks/stores/useUserData";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { session, setSession, setUser } = useUserData();
    const isRestoring = useIsRestoring();
    const userQuery = useUserQuery();
    const userSessionQuery = useUserSessionQuery();

    const waitingForUser = !userQuery.isError && !userQuery.data;
    const waitingForSession = !userSessionQuery.isError && !userSessionQuery.data;

    const loading = session && (isRestoring || waitingForUser || waitingForSession);

    const handleError = (error: Error) => {
        if (isFetchError(error)) {
            if (error.status === 401) {
                if (session) {
                    Toast.show({
                        type: "error",
                        text1: "User Error",
                        text2: "Unauthorized.",
                    });
                }
                setUser(null);
                setSession(null);
                return;
            }
        }
        console.error(error);
        return Toast.show({
            type: "error",
            text1: "User Error",
            text2: error.message,
        });
    };

    useEffect(() => {
        if (userQuery.isPending) return;
        if (userQuery.isError) return handleError(userQuery.error);
        if (userQuery.data) setUser(userQuery.data);
    }, [userQuery.status]);

    useEffect(() => {
        if (userSessionQuery.isPending) return;
        if (userSessionQuery.isError) return handleError(userSessionQuery.error);
        if (userSessionQuery.data) setSession(userSessionQuery.data);
    }, [userSessionQuery.status]);

    if (loading) return null;
    return children;
}