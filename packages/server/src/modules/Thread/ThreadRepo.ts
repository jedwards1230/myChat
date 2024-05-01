import { Equal } from "typeorm";

import { AppDataSource } from "@/lib/pg";

import { Thread } from "@/modules/Thread/ThreadModel";
import { Message } from "@/modules/Message/MessageModel";
import tokenizer from "@/lib/tokenizer";

export const getThreadRepo = () =>
	AppDataSource.getRepository(Thread).extend({
		/** Create and add a Message to the DB, then add and save it to the Thread */
		async addMessage(thread: Thread, message: Partial<Message>, parentId?: string) {
			const res = await AppDataSource.manager.transaction(async (manager) => {
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

				const newMsg = manager.create(Message, { ...message, thread });
				await manager.save(newMsg);

				const threadMsgs = await manager.find(Message, {
					where: { thread: Equal(thread.id) },
				});

				thread.activeMessage = newMsg;
				thread.messages = [...threadMsgs, newMsg];
				const newThread = await manager.save(Thread, thread);

				return { newThread, newMsg };
			});
			return res;
		},
	});
