import { api } from "@mychat/api/client/react-query";

export function useUserPost() {
	const client = api.useUtils();

	return api.user.create.useMutation({
		onSuccess: () => client.user.all.invalidate(),
		onError: (error) => console.error("Failed to create user: " + error.message),
	});
}
