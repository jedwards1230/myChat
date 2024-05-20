import { sql } from "drizzle-orm";

import type { Document, RunForProcessing } from "../types";
import type { DocumentSearchParams } from "./document";
import { db } from "../db";
import { AgentRun } from "../db/schema/agentRun";
import { RunForProcessingRelations } from "../types";
import { extendedDocumentRepo } from "./document";
import { extendedMessageRepo } from "./message";

const _getRunForProcessing = db.query.AgentRun.findFirst({
	where: (run, { eq }) => eq(run.id, sql.placeholder("id")),
	with: RunForProcessingRelations,
}).prepare("getRunForProcessing");

export const extendedAgentRunRepo = async () => {
	const repo = db.select().from(AgentRun);

	async function getRunForProcessing(id: string): Promise<RunForProcessing> {
		const run = await _getRunForProcessing.execute({ id });
		if (!run) throw new Error(`No run found with id: ${id}`);
		return run;
	}

	async function generateRagContent(
		id: string,
		opts?: {
			tokenLimit?: number;
			documentSearch?: DocumentSearchParams;
		},
	) {
		const { tokenLimit = 1024, documentSearch } = opts ?? {};

		const run = await getRunForProcessing(id);

		const { thread } = run;
		if (!thread?.activeMessage) throw new Error("No active message found");

		const [messages, ragRes] = await Promise.all([
			extendedMessageRepo().getMessages(thread.activeMessage),
			extendedDocumentRepo().searchDocuments(
				"", //getActiveMessageContent(thread.activeMessage),
				documentSearch,
			),
		]);

		const ragMessages = trimRagMessages(ragRes, tokenLimit);
		console.log({ ragMessages });

		/* if (ragMessages.length) {
			run.files = ragMessages;
			await run.save();
			messages[0].content =
				`\n\nThe following are your memories, influenced by recent conversation:\n\n` +
				JSON.stringify(ragMessages.map((d) => d.metadata));
		} */

		return messages;
	}

	return {
		...repo,
		getRunForProcessing,
		generateRagContent,
	};
};

export function trimRagMessages(docs: Document[], tokenLimit: number) {
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

/* export function getActiveMessageContent(message: InsertMessage) {
	const content = message.content ?? "";
	const toolCalls = message.toolCalls?.map((tc) => tc.content).join(" ") ?? "";
	const files = message.files?.map((f) => f.parsedText).join(", ") ?? "";
	if (!content && !toolCalls && !files) throw new Error("No content found in message");

	return `${content} ${toolCalls} ${files}`;
} */
