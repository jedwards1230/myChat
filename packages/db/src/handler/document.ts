import { inArray } from "drizzle-orm";
import pgvector from "pgvector";
import { cosineDistance } from "pgvector/drizzle-orm";

import { EmbeddingModelMap } from "@mychat/agents/models/embedding";
import { generateEmbedding, generateEmbeddings } from "@mychat/agents/providers/openai";

import type { InsertDocument } from "../db/schema/document";
import type { Message } from "../db/schema/message";
import type { Thread } from "../db/schema/thread";
import type { User } from "../db/schema/user";
import type { Document } from "../types";
import { db } from "../db";
import { DatabaseDocument, EmbedItem } from "../db/schema/document";
import tokenizer from "../tokenizer";

export interface DocumentMetaParams {
	user?: Pick<typeof User, "id">;
	message?: Pick<typeof Message, "id">;
	thread?: Pick<typeof Thread, "id">;
}

export type DocumentInsertParams = Pick<InsertDocument, "decoded" | "metadata"> &
	Partial<Pick<typeof EmbedItem, "embedding">> &
	DocumentMetaParams;

export interface DocumentSearchParams {
	search?: { topK?: number; threshold?: number };
	filterRelation?: DocumentMetaParams;
	filterMetadata?: object;
}

export const extendedDocumentRepo = () => {
	async function addDocuments(...docs: DocumentInsertParams[]): Promise<Document[]> {
		const embeddingsBatch = await generateEmbeddings(
			docs.map((doc) => doc.decoded),
			EmbeddingModelMap["text-embedding-3-small"],
		);

		const promisedEmbeddings = embeddingsBatch.map((item) =>
			db
				.insert(EmbedItem)
				.values(item.map((e) => ({ embedding: pgvector.toSql(e) })))
				.returning(),
		);

		const savedEmbeddings = await Promise.all(promisedEmbeddings);

		const savedDocs = await db
			.insert(DatabaseDocument)
			.values(
				docs.map((doc, i) => ({
					...doc,
					tokenCount: tokenizer.estimateTokenCount(doc.decoded),
					embeddings: savedEmbeddings[i],
				})),
			)
			.returning();

		return savedDocs;
	}

	async function searchDocuments(
		input: string,
		opts?: DocumentSearchParams,
	): Promise<Document[]> {
		const { topK, threshold } = {
			...{ topK: 5, threshold: 0 },
			...opts?.search,
		};

		console.log("Add threshold", threshold);

		const inputEmbedding = await generateEmbedding(
			input,
			EmbeddingModelMap["text-embedding-3-small"],
		);

		const res = await db
			.select()
			.from(EmbedItem)
			.orderBy(cosineDistance(EmbedItem.embedding, inputEmbedding))
			.limit(topK);

		/* const res: any[] = await db.query(
			`
			SELECT *
			FROM embed_item AS item
			WHERE embedding <=> $1 >= $2
			ORDER BY embedding <=> $1 >= $2
			LIMIT $3
		`,
			[pgvector.toSql(inputEmbedding), threshold, topK],
		); */

		const docIds = res.map((item) => item.id);
		const docs = await db.query.DatabaseDocument.findMany({
			where: inArray(EmbedItem.id, docIds),
		});

		return docs;
	}

	return {
		addDocuments,
		searchDocuments,
	};
};
