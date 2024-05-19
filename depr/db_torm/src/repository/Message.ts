import type { DataSource } from "typeorm";

import { Message } from "../entity/Message";
import { extendedMessageFileRepo } from "./MessageFile";

export const extendedMessageRepo = (ds: DataSource) => {
	return ds.getTreeRepository(Message).extend({
		async getMessages(activeMessage: Message) {
			const messagesWithoutFiles = (
				await this.findAncestors(activeMessage, {
					relations: ["tool_calls", "tool_call_id", "files"],
				})
			).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
			const messages = await this.injectFilesContent(messagesWithoutFiles);
			if (messages[0]?.role !== "system")
				throw new Error("First message is not a system message");
			return messages as [Message, ...Message[]];
		},

		async injectFileContent(message: Message) {
			if (message.files && message.files.length > 0) {
				const files = await extendedMessageFileRepo(ds).parseFiles(message.files);
				message.content = `${message.content}\n${files}`;
			}
			return message;
		},

		async injectFilesContent(messages: Message[]) {
			const parsed = messages.map(async (message) =>
				this.injectFileContent(message),
			);

			return (await Promise.all(parsed)).sort(
				(a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
			);
		},
	});
};
