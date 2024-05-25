import { api } from "@mychat/api/client/react-query";

export function useUserSessionDelete() {
	const client = api.useUtils();

	return api.user.delete.useMutation({
		onSuccess: () => client.user.all.invalidate(),
		onError: (error) => console.error("Failed to delete message: " + error.message),
	});
}
