import type { AnyPgColumn } from "drizzle-orm/pg-core";
import type { z } from "zod";
import { relations } from "drizzle-orm";
import {
	bigint,
	customType,
	integer,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Message } from "./message";

export const MessageFile = pgTable(
	"MessageFile",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		name: text("name").notNull(),
		path: text("path"),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		lastModified: bigint("lastModified", { mode: "number" }),
		uploadDate: timestamp("uploadDate", { mode: "string" }).defaultNow().notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		size: bigint("size", { mode: "number" }).notNull(),
		mimetype: text("mimetype").notNull(),
		tokenCount: integer("tokenCount"),
		extension: text("extension").notNull(),
		parsedText: text("parsedText"),
		fileDataId: uuid("fileDataId").references((): AnyPgColumn => FileData.id),
		messageId: uuid("messageId").references(() => Message.id, {
			onDelete: "cascade",
		}),
	},
	(table) => {
		return {
			REL_251e73e4405200edd05f962ef0: unique("REL_251e73e4405200edd05f962ef0").on(
				table.fileDataId,
			),
		};
	},
);

export const InsertMessageFileSchema = createInsertSchema(MessageFile);
export type InsertMessageFile = z.infer<typeof InsertMessageFileSchema>;

export const SelectMessageFileSchema = createSelectSchema(MessageFile);
export type SelectMessageFile = z.infer<typeof SelectMessageFileSchema>;

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
	dataType() {
		return "bytea";
	},
});

export const FileData = pgTable(
	"FileData",
	{
		id: uuid("id").defaultRandom().primaryKey().notNull(),
		blob: bytea("blob").notNull(),
		messageFileId: uuid("messageFileId").references(
			(): AnyPgColumn => MessageFile.id,
		),
	},
	(table) => {
		return {
			REL_bb4c5813ed4c9713c3068289a7: unique("REL_bb4c5813ed4c9713c3068289a7").on(
				table.messageFileId,
			),
		};
	},
);

export const MessageFileRelations = relations(MessageFile, ({ one, many }) => ({
	FileDatum: one(FileData, {
		fields: [MessageFile.fileDataId],
		references: [FileData.id],
		relationName: "MessageFile_fileDataId_FileData_id",
	}),
	Message: one(Message, {
		fields: [MessageFile.messageId],
		references: [Message.id],
	}),
	FileData: many(FileData, {
		relationName: "FileData_messageFileId_MessageFile_id",
	}),
}));

export const FileDataRelations = relations(FileData, ({ one, many }) => ({
	MessageFiles: many(MessageFile, {
		relationName: "MessageFile_fileDataId_FileData_id",
	}),
	MessageFile: one(MessageFile, {
		fields: [FileData.messageFileId],
		references: [MessageFile.id],
		relationName: "FileData_messageFileId_MessageFile_id",
	}),
}));
