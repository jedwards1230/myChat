import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@mychat/db";
import { CreateUserSchema, User, UserSession } from "@mychat/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = {
	all: publicProcedure.query(({ ctx }) => {
		// return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
		return ctx.db.query.User.findMany({
			orderBy: desc(User.id),
			limit: 10,
		});
	}),

	byId: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
		// return ctx.db
		//   .select()
		//   .from(schema.post)
		//   .where(eq(schema.post.id, input.id));
		return ctx.db.query.User.findFirst({
			where: eq(User.id, input.id),
		});
	}),

	create: protectedProcedure.input(CreateUserSchema).mutation(({ ctx, input }) => {
		return ctx.db.insert(User).values(input);
	}),

	login: publicProcedure.input(CreateUserSchema).mutation(({ ctx, input }) => {
		return ctx.db.query.User.findFirst({
			where: eq(User.email, input.email),
		});
	}),

	logout: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
		return ctx.db.delete(UserSession).where(eq(UserSession.userId, input));
	}),

	delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
		return ctx.db.delete(User).where(eq(User.id, input));
	}),
} satisfies TRPCRouterRecord;
