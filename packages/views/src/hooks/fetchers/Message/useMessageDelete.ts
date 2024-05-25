import { api } from "@mychat/api/client/react-query";

export function useMessageDelete() {
	const client = api.useUtils();

	return api.message.delete.useMutation({
		onSuccess: () => client.message.all.invalidate(),
		onError: (error) => console.error("Failed to delete message: " + error.message),
	});
}
