import { useEffect, useState } from "react";
import { useUserSessionQuery } from "./queries/useUserQuery";
import { useUserData } from "./stores/useUserData";

export function useUser() {
	const [loading, setLoading] = useState(true);
	const { session, setSession } = useUserData();
	const userQuery = useUserSessionQuery(session?.id || null);

	const verify = () => {
		const sessionId = session?.id;
		if (!sessionId) return setSession(null);
		try {
			setSession(session);
		} catch (error) {
			setSession(null);
		}
	};

	useEffect(() => {
		verify();
	}, [userQuery.data]);

	useEffect(() => {
		setLoading(false);
	}, []);

	return { loading, data: userQuery.data };
}
