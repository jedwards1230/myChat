import type { SelectThread } from "../schema/thread";
import type { GetMessage } from "../types";
import { db } from "../client";
import { Thread } from "../schema/thread";
import tokenizer from "../tokenizer";

export const extendedThreadRepo = () => {
	const select = db.select().from(Thread);
	const insert = db.insert(Thread);
	const update = db.update(Thread);
	const remove = db.delete(Thread);

	async function addMessage(
		thread: SelectThread,
		message: GetMessage,
		parentId?: string,
	) {
		const res = await db.transaction(async (tx) => {
			console.log(tx, thread, parentId);
			/* if (parentId) {
				const parent = await tx.query.Message.findFirst({
					where: eq(Message.id, parentId),
				});

				if (!parent) {
					throw new Error("No parent message found");
				}

				message.parent = parent.id;
			} else if (thread.activeMessageId) {
				message.parentId = thread.activeMessageId;
			}

			if (!message.parentId && message.role !== "system") {
				throw new Error("No parent message found");
			} */

			if (message.content) {
				message.tokenCount = tokenizer.estimateTokenCount(message.content);
			}

			/* const newMsgs = await tx
				.insert(Message)
				.values({ ...message, threadId: thread.id })
				.returning();

			const newMsg = newMsgs[0];
			if (!newMsg) {
				throw new Error("No message returned");
			}

			const threadMsgs = await tx.query.Message.findMany({
				where: inArray(Message.id, thread.messages),
			});

			thread.activeMessageId = newMsg.id;
			thread.messages = [...threadMsgs, newMsg];
			await tx.update(Thread).set(thread);

			return newMsg; */
			return message;
		});
		return res;
	}

	return {
		...select,
		...insert,
		...update,
		...remove,
		addMessage,
	};
};
