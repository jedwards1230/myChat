import type { User } from "@/modules/User/UserModel";
import type { Thread } from "@/modules/Thread/ThreadModel";
import type { Agent } from "@/modules/Agent/AgentModel";
import type { Message } from "@/modules/Message/MessageModel";
import type { AgentTool } from "@/modules/AgentTool/AgentToolModel";

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
