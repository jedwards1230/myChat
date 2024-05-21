import { sql } from "drizzle-orm";

import type { GetMessage } from "../types";
import { db } from "../client";
import { Message } from "../schema/message";
import { extendedMessageFileRepo } from "./messageFile";

const _getMessage = db.query.Message.findFirst({
	where: (msg, { eq }) => eq(msg.id, sql.placeholder("id")),
}).prepare("getMessage>");

export const extendedMessageRepo = () => {
	const select = db.select().from(Message);
	const insert = db.insert(Message);
	const remove = db.delete(Message);

	async function getMessages(message: GetMessage) {
		console.log(message);
		const messagesWithoutFiles = await findAncestors(message);
		const messages = await injectFilesContent(messagesWithoutFiles);
		if (messages[0]?.role !== "system")
			throw new Error("First message is not a system message");
		return messages as [GetMessage, ...GetMessage[]];
	}

	async function findAncestors(message: GetMessage) {
		// find with relations the list of ancestors
		return [message].sort(sortMessages);
	}

	async function injectFileContent(message: GetMessage) {
		console.log(message);
		if (message.files && message.files.length > 0) {
			const files = await extendedMessageFileRepo().parseFiles(message.files);
			message.content = `${message.content}\n${files}`;
		}
		return message;
	}

	async function injectFilesContent(messages: GetMessage[]) {
		console.log(messages);
		const parsed = messages.map(async (message) => injectFileContent(message));

		return (await Promise.all(parsed)).sort(sortMessages);
	}

	return {
		...select,
		...insert,
		...remove,
		getMessages,
		injectFileContent,
		injectFilesContent,
	};
};

function sortMessages(a: GetMessage, b: GetMessage) {
	return (
		new Date(a.createdAt).getMilliseconds() - new Date(b.createdAt).getMilliseconds()
	);
}
