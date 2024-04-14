"use client";

import { useUserData } from "@/hooks/stores/useUserData";
import { useEffect, useState } from "react";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
	const verifySession = useUserData((state) => state.verify);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		verifySession().finally(() => setLoading(false));
	}, []);

	if (loading) return null;
	return children;
}
