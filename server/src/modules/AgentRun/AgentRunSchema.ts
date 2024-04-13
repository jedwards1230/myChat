import z from "zod";

export const CreateRunBody = z.object({
	stream: z.optional(z.boolean()),
	type: z.string(),
});
export type CreateRunBody = z.infer<typeof CreateRunBody>;
