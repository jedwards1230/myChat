import { relations } from "drizzle-orm/relations";

import {
	Agent,
	agent_tools_agent_tool,
	AgentRun,
	AgentTool,
	document,
	FileData,
	Message,
	Message_closure,
	MessageFile,
	Thread,
	ToolCall,
	User,
	UserSession,
} from "./schema";

export const UserRelations = relations(User, ({ one, many }) => ({
	Agent: one(Agent, {
		fields: [User.defaultAgentId],
		references: [Agent.id],
		relationName: "User_defaultAgentId_Agent_id",
	}),
	AgentTools: many(AgentTool),
	Agents: many(Agent, {
		relationName: "Agent_ownerId_User_id",
	}),
	UserSessions: many(UserSession),
	Threads: many(Thread),
	documents: many(document),
}));

export const AgentRelations = relations(Agent, ({ one, many }) => ({
	Users: many(User, {
		relationName: "User_defaultAgentId_Agent_id",
	}),
	User: one(User, {
		fields: [Agent.ownerId],
		references: [User.id],
		relationName: "Agent_ownerId_User_id",
	}),
	Threads: many(Thread),
	AgentRuns: many(AgentRun),
	agent_tools_agent_tools: many(agent_tools_agent_tool),
}));

export const AgentToolRelations = relations(AgentTool, ({ one, many }) => ({
	User: one(User, {
		fields: [AgentTool.ownerId],
		references: [User.id],
	}),
	agent_tools_agent_tools: many(agent_tools_agent_tool),
}));

export const UserSessionRelations = relations(UserSession, ({ one }) => ({
	User: one(User, {
		fields: [UserSession.userId],
		references: [User.id],
	}),
}));

export const ThreadRelations = relations(Thread, ({ one, many }) => ({
	Message: one(Message, {
		fields: [Thread.activeMessageId],
		references: [Message.id],
		relationName: "Thread_activeMessageId_Message_id",
	}),
	Agent: one(Agent, {
		fields: [Thread.agentId],
		references: [Agent.id],
	}),
	User: one(User, {
		fields: [Thread.userId],
		references: [User.id],
	}),
	documents: many(document),
	Messages: many(Message, {
		relationName: "Message_threadId_Thread_id",
	}),
	AgentRuns: many(AgentRun),
}));

export const MessageRelations = relations(Message, ({ one, many }) => ({
	Threads: many(Thread, {
		relationName: "Thread_activeMessageId_Message_id",
	}),
	documents: many(document),
	Thread: one(Thread, {
		fields: [Message.threadId],
		references: [Thread.id],
		relationName: "Message_threadId_Thread_id",
	}),
	ToolCall: one(ToolCall, {
		fields: [Message.toolCallIdId],
		references: [ToolCall.id],
		relationName: "Message_toolCallIdId_ToolCall_id",
	}),
	Message: one(Message, {
		fields: [Message.parentId],
		references: [Message.id],
		relationName: "Message_parentId_Message_id",
	}),
	Messages: many(Message, {
		relationName: "Message_parentId_Message_id",
	}),
	MessageFiles: many(MessageFile),
	ToolCalls: many(ToolCall, {
		relationName: "ToolCall_assistantMessageId_Message_id",
	}),
	Message_closures_id_ancestor: many(Message_closure, {
		relationName: "Message_closure_id_ancestor_Message_id",
	}),
	Message_closures_id_descendant: many(Message_closure, {
		relationName: "Message_closure_id_descendant_Message_id",
	}),
}));

export const documentRelations = relations(document, ({ one, many }) => ({
	Thread: one(Thread, {
		fields: [document.threadId],
		references: [Thread.id],
	}),
	User: one(User, {
		fields: [document.userId],
		references: [User.id],
	}),
	Message: one(Message, {
		fields: [document.messageId],
		references: [Message.id],
	}),
	AgentRuns: many(AgentRun),
}));

export const ToolCallRelations = relations(ToolCall, ({ one, many }) => ({
	Messages: many(Message, {
		relationName: "Message_toolCallIdId_ToolCall_id",
	}),
	Message: one(Message, {
		fields: [ToolCall.assistantMessageId],
		references: [Message.id],
		relationName: "ToolCall_assistantMessageId_Message_id",
	}),
}));

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

export const AgentRunRelations = relations(AgentRun, ({ one }) => ({
	Thread: one(Thread, {
		fields: [AgentRun.threadId],
		references: [Thread.id],
	}),
	Agent: one(Agent, {
		fields: [AgentRun.agentId],
		references: [Agent.id],
	}),
	document: one(document, {
		fields: [AgentRun.filesId],
		references: [document.id],
	}),
}));

export const agent_tools_agent_toolRelations = relations(
	agent_tools_agent_tool,
	({ one }) => ({
		Agent: one(Agent, {
			fields: [agent_tools_agent_tool.agentId],
			references: [Agent.id],
		}),
		AgentTool: one(AgentTool, {
			fields: [agent_tools_agent_tool.agentToolId],
			references: [AgentTool.id],
		}),
	}),
);

export const Message_closureRelations = relations(Message_closure, ({ one }) => ({
	Message_id_ancestor: one(Message, {
		fields: [Message_closure.id_ancestor],
		references: [Message.id],
		relationName: "Message_closure_id_ancestor_Message_id",
	}),
	Message_id_descendant: one(Message, {
		fields: [Message_closure.id_descendant],
		references: [Message.id],
		relationName: "Message_closure_id_descendant_Message_id",
	}),
}));
