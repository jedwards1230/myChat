import type { DataSource } from "typeorm";

import type { DatabaseDocument } from "../entity/Document";
import type { Message } from "../entity/Message";
import type { DocumentSearchParams } from "./DocumentRepo";
import { AgentRun } from "../entity/AgentRun";
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

			const [messages, ragRes] = await Promise.all([
				extendedMessageRepo(ds).getMessages(thread.activeMessage),
				extendedDocumentRepo(ds).searchDocuments(
					getActiveMessageContent(thread.activeMessage),
					documentSearch,
				),
			]);

			const ragMessages = trimRagMessages(ragRes, tokenLimit);

			if (ragMessages.length) {
				run.files = ragMessages;
				await run.save();
				messages[0].content =
					`\n\nThe following are your memories, influenced by recent conversation:\n\n` +
					JSON.stringify(ragMessages.map((d) => d.metadata));
			}

			return messages;
		},
	});
};

function trimRagMessages(docs: DatabaseDocument[], tokenLimit: number) {
	let tokens = 0;
	const ragMessages = [];
	for (const res of docs) {
		if (tokens >= tokenLimit) break;
		if (res.tokenCount === null) throw new Error("No token count found in document");
		tokens += res.tokenCount;
		ragMessages.push(res);
	}

	return ragMessages;
}

function getActiveMessageContent(message: Message) {
	const content = message.content ?? "";
	const toolCalls = message.tool_calls?.map((tc) => tc.content).join(" ") ?? "";
	const files = message.files?.map((f) => f.parsedText).join(", ") ?? "";
	if (!content && !toolCalls && !files) throw new Error("No content found in message");

	return `${content} ${toolCalls} ${files}`;
}
