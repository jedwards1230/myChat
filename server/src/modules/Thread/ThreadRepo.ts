import { Equal, type FindOneOptions } from "typeorm";

import { AppDataSource } from "@/lib/pg";

import { Thread } from "@/modules/Thread/ThreadModel";
import { Message } from "@/modules/Message/MessageModel";
import type { User } from "@/modules/User/UserModel";
import logger from "@/lib/logs/logger";
import tokenizer from "@/lib/tokenizer";
import { getMessageRepo } from "../Message/MessageRepo";

export const getThreadRepo = () =>
	AppDataSource.getRepository(Thread).extend({
		async getThreadById(
			user: User,
			id: string,
			relations?: FindOneOptions<Thread>["relations"]
		) {
			return this.findOne({
				where: { id, user: Equal(user.id) },
				relations,
			});
		},

		/** Create and add a Message to the DB, then add and save it to the Thread */
		async addMessage(thread: Thread, message: Partial<Message>, parentId?: string) {
			const newThread = await AppDataSource.manager.transaction(async (manager) => {
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

				const newMsg = await manager.save(Message, { ...message, thread });

				const threadMsgs = await manager.find(Message, {
					where: { thread: Equal(thread.id) },
				});

				thread.activeMessage = newMsg;
				thread.messages = [...threadMsgs, newMsg];
				const newThread = await manager.save(Thread, thread);

				return newThread;
			});
			return this.updateTokenCount(newThread);
		},

		async updateTokenCount(thread: Thread) {
			if (!thread.activeMessage) throw new Error("No active message found");
			const currentHistory = await getMessageRepo().getMessageHistoryList(
				thread.activeMessage
			);

			const tokenCount = currentHistory.reduce((acc, msg) => {
				let count = msg.tokenCount || 0;
				if (msg.files) {
					count += msg.files.reduce((acc, file) => {
						return acc + (file.tokenCount || 0);
					}, 0);
				}
				return acc + count;
			}, 0);

			thread.tokenCount = tokenCount;
			return this.save(thread);
		},

		/** Create a new Thread and add a system message */
		async createThread(user: User) {
			return AppDataSource.manager.transaction(async (manager) => {
				const newMsg = await manager.save(Message, {
					role: "system",
					content: user.defaultAgent.systemMessage,
					name: user.defaultAgent.name,
				});

				const thread = await manager.save(Thread, {
					user,
					agent: user.defaultAgent,
				});

				thread.activeMessage = newMsg;
				thread.messages = [newMsg];

				return manager.save(Thread, thread);
			});
		},

		/** Return a Thread if it exists, otherwise create a new one */
		async getOrCreateThread(user: User, id?: string | null) {
			if (id) {
				return this.findOne({
					where: { id, user: Equal(user.id) },
					relations: ["activeMessage", "messages"],
				});
			} else {
				return this.createThread(user);
			}
		},

		/** Delete a thread. Cascades Messages */
		async deleteThread(user: User, id: string) {
			return AppDataSource.manager.transaction(async (manager) => {
				const thread = await manager.findOneByOrFail(Thread, {
					id,
					user: Equal(user.id),
				});
				const removed = await manager.remove(thread);
				return removed;
			});
		},
	});
