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

	async function getMessages(messageId: string) {
		console.log(messageId);
		const messagesWithoutFiles = await findAncestors(messageId);
		const messages = await injectFilesContent(messagesWithoutFiles);
		if (messages[0]?.role !== "system")
			throw new Error("First message is not a system message");
		return messages as [GetMessage, ...GetMessage[]];
	}

	async function findAncestors(messageId: string) {
		// find with relations the list of ancestors
		const result = await db.execute(sql`
			WITH RECURSIVE ancestors AS (
				SELECT * FROM message_closure WHERE id_descendant = ${messageId}
				UNION ALL
				SELECT mc.* FROM message_closure mc
				JOIN ancestors a ON mc.id_descendant = a.id_ancestor
			)
			SELECT * FROM message WHERE id IN (SELECT id_ancestor FROM ancestors)
			ORDER BY createdAt
		`);
		const messages = result as unknown as GetMessage[];

		return messages.sort(sortMessages);
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

export async function getRootMessage(messageId: string) {
	const result = await db.execute(sql`
		SELECT id_ancestor
		FROM message_closure
		WHERE id_descendant = ${messageId}
		ORDER BY createdAt ASC
		LIMIT 1
	`);
	return result[0]?.id_ancestor ?? messageId;
}

export async function getCurrentBranch(messageId: string) {
	const result = await db.execute(sql`
		WITH RECURSIVE branch AS (
			SELECT * FROM message_closure WHERE id_descendant = ${messageId}
			UNION ALL
			SELECT mc.* FROM message_closure mc
			JOIN branch b ON mc.id_ancestor = b.id_descendant
		)
		SELECT * FROM message WHERE id IN (SELECT id_descendant FROM branch)
		ORDER BY createdAt
	`);
	return result;
}

export async function getSiblingIds(messageId: string) {
	const result = await db.execute(sql`
		SELECT id_descendant
		FROM message_closure
		WHERE id_ancestor = ${messageId}
	`);
	return result.map((row) => row.id_descendant);
}
