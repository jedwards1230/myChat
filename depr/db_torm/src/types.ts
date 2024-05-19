import type { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import {
	Agent,
	AgentRun,
	AgentTool,
	document,
	FileData,
	Message,
	MessageFile,
	Thread,
	ToolCall,
	User,
	UserSession,
} from "./schema";

// Agent
export const insertAgentSchema = createInsertSchema(Agent);
export type InsertAgent = z.infer<typeof insertAgentSchema>;

export const selectAgentSchema = createSelectSchema(Agent);
export type SelectAgent = z.infer<typeof selectAgentSchema>;

// AgentRun
export const insertAgentRunSchema = createInsertSchema(AgentRun);
export type InsertAgentRun = z.infer<typeof insertAgentRunSchema>;

export const selectAgentRunSchema = createSelectSchema(AgentRun);
export type SelectAgentRun = z.infer<typeof selectAgentRunSchema>;

// AgentTool
export const insertAgentToolSchema = createInsertSchema(AgentTool);
export type InsertAgentTool = z.infer<typeof insertAgentToolSchema>;

export const selectAgentToolSchema = createSelectSchema(AgentTool);
export type SelectAgentTool = z.infer<typeof selectAgentToolSchema>;

// Document
export const insertDocumentSchema = createInsertSchema(document);
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export const selectDocumentSchema = createSelectSchema(document);
export type SelectDocument = z.infer<typeof selectDocumentSchema>;

// FileData
export const insertFileDataSchema = createInsertSchema(FileData);
export type InsertFileData = z.infer<typeof insertFileDataSchema>;

export const selectFileDataSchema = createSelectSchema(FileData);
export type SelectFileData = z.infer<typeof selectFileDataSchema>;

// Message
export const insertMessageSchema = createInsertSchema(Message);
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export const selectMessageSchema = createSelectSchema(Message);
export type SelectMessage = z.infer<typeof selectMessageSchema>;

// MessageFile
export const insertMessageFileSchema = createInsertSchema(MessageFile);
export type InsertMessageFile = z.infer<typeof insertMessageFileSchema>;

export const selectMessageFileSchema = createSelectSchema(MessageFile);
export type SelectMessageFile = z.infer<typeof selectMessageFileSchema>;

// Thread
export const insertThreadSchema = createInsertSchema(Thread);
export type InsertThread = z.infer<typeof insertThreadSchema>;

export const selectThreadSchema = createSelectSchema(Thread);
export type SelectThread = z.infer<typeof selectThreadSchema>;

// ToolCall
export const insertToolCallSchema = createInsertSchema(ToolCall);
export type InsertToolCall = z.infer<typeof insertToolCallSchema>;

export const selectToolCallSchema = createSelectSchema(ToolCall);
export type SelectToolCall = z.infer<typeof selectToolCallSchema>;

// User
export const insertUserSchema = createInsertSchema(User);
export type InsertUser = z.infer<typeof insertUserSchema>;

export const selectUserSchema = createSelectSchema(User);
export type SelectUser = z.infer<typeof selectUserSchema>;

// UserSession
export const insertUserSessionSchema = createInsertSchema(UserSession);
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;

export const selectUserSessionSchema = createSelectSchema(UserSession);
export type SelectUserSession = z.infer<typeof selectUserSessionSchema>;
