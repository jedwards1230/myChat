import { adminRouter } from "./admin";
import { agentRouter } from "./agent";
import { agentRunRouter } from "./agentRun";
import { agentToolRouter } from "./agentTool";
import { chatRouter } from "./chat";
import { databaseDocumentRouter } from "./document";
import { messageRouter } from "./message";
import { messageFileRouter } from "./messageFile";
import { threadRouter } from "./thread";
import { toolCallRouter } from "./toolCall";
import { userRouter } from "./user";

export const routers = {
	admin: adminRouter,
	agent: agentRouter,
	agentRun: agentRunRouter,
	agentTool: agentToolRouter,
	chat: chatRouter,
	databaseDocument: databaseDocumentRouter,
	message: messageRouter,
	messageFile: messageFileRouter,
	thread: threadRouter,
	toolCall: toolCallRouter,
	user: userRouter,
};
