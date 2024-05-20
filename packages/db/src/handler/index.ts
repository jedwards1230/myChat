import { db } from "../db";
import { Agent } from "../db/schema/agent";
import { AgentTool } from "../db/schema/agentTool";
import { EmbedItem } from "../db/schema/document";
import { FileData } from "../db/schema/messageFile";
import { ToolCall } from "../db/schema/toolCall";
import { User, UserSession } from "../db/schema/user";
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
