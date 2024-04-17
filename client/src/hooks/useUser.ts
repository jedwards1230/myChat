import { useEffect, useState } from "react";
import { useUserSessionQuery } from "./queries/useUserQuery";
import { useUserData } from "./stores/useUserData";

export function useUser() {
	const [mounted, setMounted] = useState(true);
	useEffect(() => setMounted(false), []);

	const { session, setSession } = useUserData();
	const userQuery = useUserSessionQuery(session?.id || null);

	useEffect(() => {
		if (userQuery.isPending) return;
		if (userQuery.isError) {
			setSession(null);
			return;
		}
		setSession(userQuery.data);
	}, [userQuery.status]);

	return { loading: mounted, data: userQuery.data };
}
