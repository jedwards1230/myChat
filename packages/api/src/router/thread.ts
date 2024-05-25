import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@mychat/db";
import { CreateThreadSchema, Thread } from "@mychat/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const threadRouter = {
	all: publicProcedure.query(({ ctx }) => {
		// return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
		return ctx.db.query.Thread.findMany({
			orderBy: desc(Thread.id),
			limit: 10,
		});
	}),

	byId: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
		// return ctx.db
		//   .select()
		//   .from(schema.post)
		//   .where(eq(schema.post.id, input.id));
		return ctx.db.query.Thread.findFirst({
			where: eq(Thread.id, input.id),
		});
	}),

	create: protectedProcedure.input(CreateThreadSchema).mutation(({ ctx, input }) => {
		return ctx.db.insert(Thread).values(input).returning();
	}),

	edit: protectedProcedure
		.input(z.object({ id: z.string(), data: CreateThreadSchema }))
		.mutation(({ ctx, input }) => {
			return ctx.db.update(Thread).set(input.data).where(eq(Thread.id, input.id));
		}),

	delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
		return ctx.db.delete(Thread).where(eq(Thread.id, input));
	}),

	deleteAll: protectedProcedure.mutation(({ ctx }) => {
		return ctx.db.delete(Thread);
	}),
} satisfies TRPCRouterRecord;
