import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { useIsRestoring } from "@tanstack/react-query";

import { api } from "@mychat/api/client/react-query";
import { isFetchError } from "@mychat/api/fetcher";
import { useUserData } from "@mychat/views/hooks/useUserData";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const { session, setSession, setUser } = useUserData();
	const isRestoring = useIsRestoring();
	const userQuery = api.user.byId.useQuery({ id: "me" });
	const userSessionQuery = api.user.byId.useQuery({ id: "me" });

	const waitingForUser = !userQuery.isError && !userQuery.data;
	const waitingForSession = !userSessionQuery.isError && !userSessionQuery.data;

	const loading = session && (isRestoring || waitingForUser || waitingForSession);

	const handleError = (error: Error) => {
		if (isFetchError(error)) {
			if (error.status === 401) {
				if (session) {
					Toast.show({
						type: "error",
						text1: "Unauthorized",
						text2: error.message,
					});
				}
				setUser(null);
				setSession(null);
				return;
			}
		}
	};

	useEffect(() => {
		if (session && new Date(session.expire) < new Date()) {
			setSession(null);
			Toast.show({
				type: "error",
				text1: "Session Error",
				text2: "Your session has expired.",
			});
		}
	}, []);

	useEffect(() => {
		if (userQuery.isPending) return;
		if (userQuery.isError) return handleError(userQuery.error as any as Error);
		if (userQuery.data) setUser(userQuery.data);
	}, [userQuery.status]);

	useEffect(() => {
		if (userSessionQuery.isPending) return;
		if (userSessionQuery.isError)
			return handleError(userSessionQuery.error as any as Error);
		if (userSessionQuery.data) setSession(userSessionQuery.data as any);
	}, [userSessionQuery.status]);

	if (loading) return null;
	return children;
}
