import { In, type DataSource } from "typeorm";
import pgvector from "pgvector";

import type { Message } from "../entity/Message";
import type { User } from "../entity/User";
import type { Thread } from "../entity/Thread";
import { DatabaseDocument, EmbedItem } from "../entity/Document";

import { generateEmbedding, generateEmbeddings } from "@mychat/agents/providers/openai";
import tokenizer from "@mychat/agents/tokenizer";
import { logger } from "../logger";

export type DocumentMetaParams = {
	user?: Pick<User, "id">;
	message?: Pick<Message, "id">;
	thread?: Pick<Thread, "id">;
};

export type DocumentInsertParams = Pick<DatabaseDocument, "decoded" | "metadata"> &
	Partial<Pick<EmbedItem, "embedding">> &
	DocumentMetaParams;

export type DocumentSearchParams = {
	search?: { topK?: number; threshold?: number };
	filterRelation?: DocumentMetaParams;
	filterMetadata?: object;
};

export const extendedDocumentRepo = (ds: DataSource) => {
	const embedItemRepo = ds.getRepository(EmbedItem);
	return ds.getRepository(DatabaseDocument).extend({
		async addDocuments(...docs: DocumentInsertParams[]): Promise<DatabaseDocument[]> {
			try {
				const embeddings = await generateEmbeddings(
					docs.map((doc) => doc.decoded)
				);

				const savedEmbeddings = await embedItemRepo.save(
					embeddings.map((e) =>
						embedItemRepo.create({ embedding: pgvector.toSql(e) })
					)
				);

				const savedDocs = await this.save(
					docs.map((doc, i) => ({
						...doc,
						tokenCount: tokenizer.estimateTokenCount(doc.decoded),
						embedding: savedEmbeddings[i],
					}))
				);

				return savedDocs;
			} catch (error) {
				logger.error("Error adding documents", {
					error,
					functionName: "documentRepo.addDocuments",
				});
				throw error;
			}
		},

		async searchDocuments(
			input: string,
			opts?: DocumentSearchParams
		): Promise<DatabaseDocument[]> {
			try {
				const { topK, threshold } = {
					...{ topK: 5, threshold: 0 },
					...opts?.search,
				};

				const inputEmbedding = await generateEmbedding(input);
				const res = await ds.query(
					`
					SELECT *
					FROM embed_item AS item
					WHERE embedding <=> $1 >= $2
					ORDER BY embedding <=> $1 >= $2
					LIMIT $3
				`,
					[pgvector.toSql(inputEmbedding), threshold, topK]
				);

				const docIds = res.map((item: any) => item.id);
				const docs = await this.find({
					where: { embeddings: { id: In(docIds) }, ...opts?.filterRelation },
				});

				return docs;
			} catch (error) {
				logger.error("Error searching documents", {
					error,
					functionName: "documentRepo.searchDocuments",
				});
				throw error;
			}
		},
	});
};
