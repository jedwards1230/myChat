import { useEffect, useState } from "react";
import { useUserQuery, useUserSessionQuery } from "./fetchers/User/useUserQuery";
import { useUserData } from "./stores/useUserData";

export function useUser() {
	const [mounted, setMounted] = useState(true);
	useEffect(() => setMounted(false), []);

	const { session, setSession, setUser } = useUserData();
	const userQuery = useUserQuery();
	const userSessionQuery = useUserSessionQuery(session?.id || null);

	useEffect(() => {
		if (userQuery.isPending) return;
		if (userQuery.isError) {
			setUser(null);
			return;
		}
		setUser(userQuery.data);
	}, [userQuery.status]);

	useEffect(() => {
		if (userSessionQuery.isPending) return;
		if (userSessionQuery.isError) {
			setSession(null);
			return;
		}
		setSession(userSessionQuery.data);
	}, [userSessionQuery.status]);

	return {
		loading: mounted,
		data: {
			user: userQuery.data,
			session: userSessionQuery.data,
		},
	};
}
