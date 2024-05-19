import type { SelectMessage } from "../schema/message";
import { db } from "../client";
import { Message } from "../schema/message";

//import { extendedMessageFileRepo } from "./messageFile";

export const extendedMessageRepo = () => {
	const repo = db.select().from(Message);

	async function getMessages(message: SelectMessage) {
		console.log(message);
		/* const messagesWithoutFiles = (
			await repo.findAncestors(activeMessage, {
				relations: ["tool_calls", "tool_call_id", "files"],
			})
		).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
		const messages = await injectFilesContent(messagesWithoutFiles);
		if (messages[0]?.role !== "system")
			throw new Error("First message is not a system message");
		return messages as [SelectMessage, ...SelectMessage[]]; */
	}

	async function injectFileContent(message: SelectMessage) {
		console.log(message);
		/* if (message.files && message.files.length > 0) {
			const files = await extendedMessageFileRepo().parseFiles(message.files);
			message.content = `${message.content}\n${files}`;
		}
		return message; */
	}

	async function injectFilesContent(messages: SelectMessage[]) {
		console.log(messages);
		/* const parsed = messages.map(async (message) => injectFileContent(message));

		return (await Promise.all(parsed)).sort(
			(a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
		); */
	}

	return {
		...repo,
		getMessages,
		injectFileContent,
		injectFilesContent,
	};
};
