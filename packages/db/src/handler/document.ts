/* import pgvector from "pgvector";
import { In } from "typeorm"; */

//import { EmbeddingModelMap } from "@mychat/agents/models/embedding";
//import { generateEmbedding, generateEmbeddings } from "@mychat/agents/providers/openai";
//import tokenizer from "../tokenizer";

import type { EmbedItem } from "../schema/document";
import type { Message } from "../schema/message";
import type { Thread } from "../schema/thread";
import type { User } from "../schema/user";
import { db } from "../client";
import { DatabaseDocument } from "../schema/document";

export interface DocumentMetaParams {
	user?: Pick<typeof User, "id">;
	message?: Pick<typeof Message, "id">;
	thread?: Pick<typeof Thread, "id">;
}

export type DocumentInsertParams = Pick<typeof DatabaseDocument, "decoded" | "metadata"> &
	Partial<Pick<typeof EmbedItem, "embedding">> &
	DocumentMetaParams;

export interface DocumentSearchParams {
	search?: { topK?: number; threshold?: number };
	filterRelation?: DocumentMetaParams;
	filterMetadata?: object;
}

export const extendedDocumentRepo = () => {
	//const embedItemRepo = db.select().from(EmbedItem);
	const repo = db.select().from(DatabaseDocument);

	/* async function addDocuments(
		...docs: DocumentInsertParams[]
	): Promise<(typeof DatabaseDocument)[]> {
		const embeddingsBatch = await generateEmbeddings(
			docs.map((doc) => doc.decoded),
			EmbeddingModelMap["text-embedding-3-small"],
		);

		const promisedEmbeddings = embeddingsBatch.map((item) =>
			embedItemRepo.save(
				item.map((e) => embedItemRepo.create({ embedding: pgvector.toSql(e) })),
			),
		);

		const savedEmbeddings = await Promise.all(promisedEmbeddings);

		const savedDocs = await repo.save(
			docs.map((doc, i) =>
				repo.create({
					...doc,
					tokenCount: tokenizer.estimateTokenCount(doc.decoded),
					embeddings: savedEmbeddings[i],
				}),
			),
		);

		return savedDocs;
	} */

	/* async function searchDocuments(
		input: string,
		opts?: DocumentSearchParams,
	): Promise<(typeof DatabaseDocument)[]> {
		const { topK, threshold } = {
			...{ topK: 5, threshold: 0 },
			...opts?.search,
		};

		const inputEmbedding = await generateEmbedding(
			input,
			EmbeddingModelMap["text-embedding-3-small"],
		);
		const res: any[] = await db.query(
			`
			SELECT *
			FROM embed_item AS item
			WHERE embedding <=> $1 >= $2
			ORDER BY embedding <=> $1 >= $2
			LIMIT $3
		`,
			[pgvector.toSql(inputEmbedding), threshold, topK],
		);

		const docIds = res.map((item: any) => item.id as string);
		const docs = await repo.find({
			where: { embeddings: { id: In(docIds) }, ...opts?.filterRelation },
		});

		return docs;
	} */

	return {
		...repo,
		//addDocuments,
		//searchDocuments,
	};
};
