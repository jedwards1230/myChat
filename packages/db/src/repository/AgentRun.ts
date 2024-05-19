import type { DataSource } from "typeorm";

import type { Message } from "../entity/Message";
import type { DocumentSearchParams } from "./DocumentRepo";
import { AgentRun } from "../entity/AgentRun";
import { logger } from "../logger";
import { extendedDocumentRepo } from "./DocumentRepo";
import { extendedMessageRepo } from "./Message";

export const extendedAgentRunRepo = (ds: DataSource) => {
	return ds.getRepository(AgentRun).extend({
		async getRunForProcessing(id: string) {
			const messageOpts = {
				parent: true,
				children: true,
				tool_call_id: true,
				files: true,
				documents: true,
			};
			const run = await this.findOneOrFail({
				where: { id },
				relations: {
					thread: {
						activeMessage: messageOpts,
						agent: true,
						messages: messageOpts,
					},
					agent: true,
				},
			});

			return run;
		},

		async generateRagContent(
			id: string,
			opts?: {
				tokenLimit?: number;
				documentSearch?: DocumentSearchParams;
			},
		) {
			const { tokenLimit = 1024, documentSearch } = opts ?? {};

			const run = await this.getRunForProcessing(id);

			const { thread } = run;
			if (!thread.activeMessage) throw new Error("No active message found");

			const messages = await extendedMessageRepo(ds).getMessages(
				thread.activeMessage,
			);
			const systemMessage = messages.find((m) => m.role === "system");
			if (!systemMessage) throw new Error("No system message found");

			const activeMessageContent = getActiveMessageContent(thread.activeMessage);

			if (!activeMessageContent)
				throw new Error(
					`No active message content found for thread ${thread.id}`,
				);

			// inject rag metadata and decoded params into the system message
			const ragRes = await extendedDocumentRepo(ds).searchDocuments(
				activeMessageContent,
				documentSearch,
			);

			let tokens = 0;
			const ragMessages = [];
			for (const res of ragRes) {
				if (tokens >= tokenLimit) break;
				if (res.tokenCount === null)
					throw new Error("No token count found in document");
				tokens += res.tokenCount;
				ragMessages.push(res);
			}

			logger.debug("Generated Rag messages", {
				ragMessages,
				ragRes,
				tokenLimit,
				tokens,
				functionName: "AgentRepo.generateChatResponse",
			});

			if (ragMessages.length) {
				logger.debug("Searched documents", {
					ragMessages: ragMessages.map((d) => d.metadata),
					functionName: "AgentRunQueue.processQueue",
				});

				run.files = ragMessages;
				await run.save();
				systemMessage.content =
					`\n\nThe following are your memories, influenced by recent conversation:\n\n` +
					JSON.stringify(ragMessages.map((d) => d.metadata));
			}

			return messages;
		},
	});
};

function getActiveMessageContent(message: Message) {
	const content = message.content ?? "";
	const toolCalls = message.tool_calls?.map((tc) => tc.content).join(" ") ?? "";
	const files = message.files?.map((f) => f.parsedText).join(", ") ?? "";
	if (!content && !toolCalls && !files) throw new Error("No content found in message");

	return `${content} ${toolCalls} ${files}`;
}
