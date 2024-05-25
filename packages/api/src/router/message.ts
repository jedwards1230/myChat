import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@mychat/db";
import { CreateMessageSchema, Message } from "@mychat/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const messageRouter = {
	all: publicProcedure.query(({ ctx }) => {
		// return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
		return ctx.db.query.Message.findMany({
			orderBy: desc(Message.id),
			with: {
				children: true,
			},
			limit: 10,
		});
	}),

	byId: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
		// return ctx.db
		//   .select()
		//   .from(schema.post)
		//   .where(eq(schema.post.id, input.id));
		return ctx.db.query.Message.findFirst({
			where: eq(Message.id, input.id),
		});
	}),

	create: protectedProcedure.input(CreateMessageSchema).mutation(({ ctx, input }) => {
		return ctx.db.insert(Message).values(input).returning();
	}),

	edit: protectedProcedure
		.input(z.object({ id: z.string(), content: z.string() }))
		.mutation(({ ctx, input }) => {
			return ctx.db
				.update(Message)
				.set({ content: input.content })
				.where(eq(Message.id, input.id));
		}),

	delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
		return ctx.db.delete(Message).where(eq(Message.id, input));
	}),
} satisfies TRPCRouterRecord;
