import z from "zod";

export const AuthInput = z.object({
	email: z.string().email(),
	password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});
export type AuthInput = z.infer<typeof AuthInput>;
