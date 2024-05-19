import type {
	Agent,
	AgentTool,
	Message,
	Thread,
	User,
	UserSession,
} from "@mychat/db/schema";

declare module "fastify" {
	type Session = UserSession;
}

declare module "fastify" {
	export interface FastifyRequest {
		/** The user ID of the authenticated user */
		user: User;
		thread: Thread;
		message: Message;
		agent: Agent;
		agentTool: AgentTool;
	}
}
