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
	uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { Message } from "./message";

export const MessageFile = pgTable("message_file", {
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
});

export const MessageFileRelations = relations(MessageFile, ({ one, many }) => ({
	fileDatum: one(FileData, {
		fields: [MessageFile.fileDataId],
		references: [FileData.id],
		relationName: "MessageFile_fileDataId_FileData_id",
	}),
	message: one(Message, {
		fields: [MessageFile.messageId],
		references: [Message.id],
	}),
	fileData: many(FileData, {
		relationName: "FileData_messageFileId_MessageFile_id",
	}),
}));

export const InsertMessageFileSchema = createInsertSchema(MessageFile);
export type InsertMessageFile = z.infer<typeof InsertMessageFileSchema>;

export const SelectMessageFileSchema = createSelectSchema(MessageFile);
export type SelectMessageFile = z.infer<typeof SelectMessageFileSchema>;

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
	dataType() {
		return "bytea";
	},
});

export const FileData = pgTable("file_data", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	blob: bytea("blob").notNull(),
	messageFileId: uuid("messageFileId").references((): AnyPgColumn => MessageFile.id),
});

export const FileDataRelations = relations(FileData, ({ one, many }) => ({
	messageFiles: many(MessageFile, {
		relationName: "MessageFile_fileDataId_FileData_id",
	}),
	messageFile: one(MessageFile, {
		fields: [FileData.messageFileId],
		references: [MessageFile.id],
		relationName: "FileData_messageFileId_MessageFile_id",
	}),
}));
