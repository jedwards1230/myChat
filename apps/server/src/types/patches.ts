import type { Agent } from "@mychat/db/entity/Agent";
import type { AgentTool } from "@mychat/db/entity/AgentTool";
import type { Message } from "@mychat/db/entity/Message";
import type { UserSession } from "@mychat/db/entity/Session";
import type { Thread } from "@mychat/db/entity/Thread";
import type { User } from "@mychat/db/entity/User";

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
