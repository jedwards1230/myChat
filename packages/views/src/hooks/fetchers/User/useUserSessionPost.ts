import { api } from "@mychat/api/client/react-query";

import { useUserData } from "../../../hooks/useUserData";

export function useUserSessionPost() {
	const session = useUserData.use.session();
	const client = api.useUtils();

	return api.user.login.useMutation({
		onSuccess: async () => {
			if (session) await client.user.byId.cancel({ id: session.id });
			await client.user.all.invalidate();
		},
		onError: (error) =>
			console.error("Failed to create user session: " + error.message),
	});
}
