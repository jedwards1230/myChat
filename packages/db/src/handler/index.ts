import { db } from "../client";
import { Agent } from "../schema/agent";
import { AgentTool } from "../schema/agentTool";
import { EmbedItem } from "../schema/document";
import { FileData } from "../schema/messageFile";
import { ToolCall } from "../schema/toolCall";
import { User, UserSession } from "../schema/user";
import { extendedAgentRunRepo } from "./agentRun";
import { extendedDocumentRepo } from "./document";
import { extendedMessageRepo } from "./message";
import { extendedMessageFileRepo } from "./messageFile";
import { extendedThreadRepo } from "./thread";

export const pgRepo = {
	User: db.select().from(User),
	Agent: db.select().from(Agent),
	Thread: extendedThreadRepo(),
	Message: extendedMessageRepo(),
	Document: extendedDocumentRepo(),
	EmbedItem: db.select().from(EmbedItem),
	FileData: db.select().from(FileData),
	MessageFile: extendedMessageFileRepo(),
	AgentRun: extendedAgentRunRepo(),
	ToolCall: db.select().from(ToolCall),
	UserSession: db.select().from(UserSession),
	AgentTool: db.select().from(AgentTool),
};
