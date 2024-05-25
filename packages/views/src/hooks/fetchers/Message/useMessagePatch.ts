import { api } from "@mychat/api/client/react-query";

/** Post a message to the server */
export const useMessagePatch = () => {
	const client = api.useUtils();

	return api.message.edit.useMutation({
		onMutate: async (message) => {
			const prevMessage = client.message.byId.getData({ id: message.id });
			if (!prevMessage) return console.error("No cached message found");

			await client.message.byId.cancel({ id: message.id });
			const newMessage = { ...prevMessage, ...message };
			client.message.byId.setData({ id: message.id }, newMessage);

			return { newMessage, prevMessage };
		},
		onError: (error, message, context) => {
			if (message && context?.prevMessage)
				client.message.byId.setData({ id: message.id }, context.prevMessage);
			console.error(error);
		},
		onSettled: (res, err, message) => {
			if (!err) client.message.byId.invalidate({ id: message.id });
		},
	});
};
