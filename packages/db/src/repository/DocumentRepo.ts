import { In, type DataSource } from "typeorm";
import pgvector from "pgvector";

import type { Message } from "../entity/Message";
import type { User } from "../entity/User";
import type { Thread } from "../entity/Thread";
import { DatabaseDocument, EmbedItem } from "../entity/Document";

import { generateEmbedding, generateEmbeddings } from "@mychat/agents/providers/openai";
import { logger } from "../logger";

export type DocumentMetaParams = {
	user?: Pick<User, "id">;
	message?: Pick<Message, "id">;
	thread?: Pick<Thread, "id">;
};

export type DocumentInsertParams = Pick<DatabaseDocument, "decoded" | "metadata"> &
	Partial<Pick<DatabaseDocument, "embeddingId">> &
	DocumentMetaParams;

export const extendedDocumentRepo = (ds: DataSource) => {
	const embedItemRepo = ds.getRepository(EmbedItem);
	return ds.getRepository(DatabaseDocument).extend({
		async addDocuments(...docs: DocumentInsertParams[]): Promise<DatabaseDocument[]> {
			const embeddings = await generateEmbeddings(docs.map((doc) => doc.decoded));
			const docsPromise = docs.map((doc, i) => {
				try {
					const embedding = embedItemRepo.create({
						embedding: pgvector.toSql(embeddings[i]),
					});
					return this.create({ ...doc, embeddingId: embedding.id });
				} catch (error) {
					logger.error("Error adding document", {
						error,
						functionName: "extendedDocumentRepo.addDocuments",
					});
					throw error;
				}
			});
			return Promise.all(docsPromise);
		},

		async searchDocuments(
			input: string,
			opts?: {
				search?: { topK?: number; threshold?: number };
				filterRelation?: DocumentMetaParams;
				filterMetadata?: object;
			}
		): Promise<DatabaseDocument[]> {
			const { topK, threshold } = {
				...{ topK: 5, threshold: 0.0 },
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

			logger.debug("Search results", {
				input,
				res,
				functionName: "extendedDocumentRepo.searchDocuments",
			});

			const docIds = res.map((item: any) => item.id);
			const docs = await this.find({
				where: { embeddingId: In(docIds), ...opts?.filterRelation },
			});

			return docs;
		},
	});
};
