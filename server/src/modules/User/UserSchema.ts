import z from "zod";

import { ThreadSchema } from "../Thread/ThreadSchema";
import { AgentObjectSchema } from "../Agent/AgentSchema";

export const AuthInputSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});
export type AuthInputSchema = z.infer<typeof AuthInputSchema>;

export const UserSchema = z.object({
    id: z.string(),
    apiKey: z.string(),
    name: z.string(),
    threads: z.optional(z.array(ThreadSchema)),
    agents: z.optional(z.array(AgentObjectSchema)),
    tools: z.optional(z.array(z.any())),
    defaultAgent: AgentObjectSchema,
    sessions: z.optional(z.array(z.string())),
});
export type UserSchema = z.infer<typeof UserSchema>;
