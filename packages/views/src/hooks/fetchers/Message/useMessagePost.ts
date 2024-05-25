import { api } from "@mychat/api/client/react-query";

/** Post a message to the server */
export const useMessagePost = () => {
	const client = api.useUtils();

	return api.message.create.useMutation({
		onMutate: async (message) => {
			const prevMessages = client.message.all.getData() ?? [];
			await client.message.all.cancel();

			const messages = [
				...prevMessages,
				{
					content: message.content ?? "",
					role: message.role ?? "user",
				},
			] as typeof prevMessages;

			client.message.all.setData(undefined, messages);

			return { prevMessages, message };
		},
		onError: (error, message, context) =>
			client.message.all.setData(undefined, context?.prevMessages),
		onSettled: () => client.message.all.invalidate(),
	});
};
