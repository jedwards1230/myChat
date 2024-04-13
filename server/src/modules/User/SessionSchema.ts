import z from "zod";

export const UserSessionSchema = z.object({
	id: z.string(),
	createdAt: z.date(),
	lastActive: z.optional(z.string()),
	userId: z.string(),
	expire: z.date(),
	provider: z.literal("email"),
});
export type UserSessionSchema = z.infer<typeof UserSessionSchema>;
