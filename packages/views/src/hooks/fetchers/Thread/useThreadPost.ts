import { api } from "@mychat/api/client/react-query";

/** Create a new Thread on the server */
export function useThreadPost() {
	const client = api.useUtils();

	return api.thread.create.useMutation({
		onError: (error) => console.error(error),
		onSettled: () => client.thread.all.invalidate(),
	});
}
