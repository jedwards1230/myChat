import type { User } from "@mychat/db/entity/User";
import type { Thread } from "@mychat/db/entity/Thread";
import type { Agent } from "@mychat/db/entity/Agent";
import type { Message } from "@mychat/db/entity/Message";
import type { AgentTool } from "@mychat/db/entity/AgentTool";

import type { UserSession } from "@mychat/db/entity/Session";

declare module "fastify" {
	interface Session extends UserSession {}
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
