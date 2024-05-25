import { api } from "@mychat/api/client/react-query";

/** Patch Thread data on the server */
export function useThreadPatch() {
	const client = api.useUtils();

	return api.thread.edit.useMutation({
		onError: (error) => console.error(error),
		onSettled: () => client.thread.all.invalidate(),
	});
}
