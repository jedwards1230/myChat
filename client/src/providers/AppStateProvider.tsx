import { useUser } from "@/hooks/useUser";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
	const { loading } = useUser();
	if (loading) return null;
	return children;
}
