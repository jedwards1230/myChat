//import { eq } from "drizzle-orm";

import type { InsertDocument } from "../schema/document";
import type { InsertMessage } from "../schema/message";
//import type { DocumentSearchParams } from "./document";
import { db } from "../client";
import { AgentRun } from "../schema/agentRun";

//import { extendedDocumentRepo } from "./document";
//import { extendedMessageRepo } from "./message";

export const extendedAgentRunRepo = async () => {
	const repo = db.select().from(AgentRun);

	/* async function getRunForProcessing(id: string) {
		const messageOpts = {
			parent: true,
			children: true,
			tool_call_id: true,
			files: true,
			documents: true,
		}; */
	/* const run = await repo.findOneOrFail({
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

		const run = await db.query.AgentRun.findFirst({
			where: eq(AgentRun.id, id),
			with: { Thread: true },
		});
		if (!run) throw new Error(`No run found with id: ${id}`);

		return run;
	} */

	/* async function generateRagContent(
		id: string,
		opts?: {
			tokenLimit?: number;
			documentSearch?: DocumentSearchParams;
		},
	) {
		const { tokenLimit = 1024, documentSearch } = opts ?? {};

		const run = await getRunForProcessing(id);

		const { thread } = run;
		if (!thread.activeMessage) throw new Error("No active message found");

		const [messages, ragRes] = await Promise.all([
			extendedMessageRepo().getMessages(thread.activeMessage),
			extendedDocumentRepo().searchDocuments(
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
	} */

	return {
		...repo,
		/* getRunForProcessing,
		generateRagContent, */
	};
};

export function trimRagMessages(docs: InsertDocument[], tokenLimit: number) {
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

export function getActiveMessageContent(message: InsertMessage) {
	return message.content;
	/* const content = message.content ?? "";
	const toolCalls = message.tool_calls?.map((tc) => tc.content).join(" ") ?? "";
	const files = message.files?.map((f) => f.parsedText).join(", ") ?? "";
	if (!content && !toolCalls && !files) throw new Error("No content found in message");

	return `${content} ${toolCalls} ${files}`; */
}
