import { api } from "@mychat/api/client/react-query";

export const useRequestThreadTitleMutation = () => {
	const client = api.useUtils();

	return api.chat.init.useMutation({
		onSettled: () => client.thread.all.invalidate(),
		onError: (error) =>
			console.error("Failed to fetch thread title: " + error.message),
	});
};
