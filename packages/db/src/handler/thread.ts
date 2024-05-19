/* import { eq } from "drizzle-orm";

import type { SelectMessage } from "../schema/message";
import type { SelectThread } from "../schema/thread"; */
import { db } from "../client";
import { Thread } from "../schema/thread";

export const extendedThreadRepo = () => {
	const repo = db.select().from(Thread);

	/* async function addMessage(
		thread: SelectThread,
		message: Partial<SelectMessage>,
		parentId?: string,
	) {
		const res = await db.transaction(async (manager) => {
			if (parentId) {
				message.parent = await manager.findOneByOrFail(Message, {
					id: parentId,
				});
			} else if (thread.activeMessage) {
				message.parent = thread.activeMessage;
			}

			if (!message.parent && message.role !== "system") {
				throw new Error("No parent message found");
			}

			if (message.content) {
				message.tokenCount = tokenizer.estimateTokenCount(message.content);
			}

			const newMsg = await manager
				.create(SelectMessage, { ...message, thread })
				.save();
			const threadMsgs = await manager.find(SelectMessage, {
				where: { thread: eq(Thread.id, thread.id) },
			});

			thread.activeMessage = newMsg;
			thread.messages = [...threadMsgs, newMsg];
			await manager.save(Thread, thread);

			return newMsg;
		});
		return res;
	} */

	return {
		...repo,
		//addMessage,
	};
};
