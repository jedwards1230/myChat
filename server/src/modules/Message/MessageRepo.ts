import { AppDataSource } from "@/lib/pg";
import logger from "@/lib/logs/logger";
import { Message } from "@/modules/Message/MessageModel";
import { ToolCall } from "@/modules/Message/ToolCallModel";
import { MessageFileController } from "../File/MessageFileController";

export const ToolCallRepo = AppDataSource.getRepository(ToolCall).extend({});

export const MessageRepo = AppDataSource.getTreeRepository(Message).extend({
	/**
	 * Get the list of messages in the history of a message.
	 * Sorted by createdAt date.
	 * */
	async getMessageHistoryList(
		child: Message,
		injectFilesContent?: boolean
	): Promise<Message[]> {
		try {
			let history = await this.findAncestors(child, {
				relations: ["tool_calls", "tool_call_id", "files"],
			});
			if (injectFilesContent) {
				const parsed = history.map(async (message) => {
					if (message.files) {
						const files = await MessageFileController.parseFiles(
							message.files
						);

						message.content = `${message.content}\n${files}`;
					}
					return message;
				});

				history = await Promise.all(parsed);
			}
			return history.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
		} catch (e) {
			logger.error({ error: e, functionName: "MessageRepo.getMessageHistoryList" });
			throw e;
		}
	},
});
