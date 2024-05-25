import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@mychat/db";
import { CreateToolCallSchema, ToolCall } from "@mychat/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const toolCallRouter = {
	all: publicProcedure.query(({ ctx }) => {
		// return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
		return ctx.db.query.ToolCall.findMany({
			orderBy: desc(ToolCall.id),
			limit: 10,
		});
	}),

	byId: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
		// return ctx.db
		//   .select()
		//   .from(schema.post)
		//   .where(eq(schema.post.id, input.id));
		return ctx.db.query.ToolCall.findFirst({
			where: eq(ToolCall.id, input.id),
		});
	}),

	create: protectedProcedure.input(CreateToolCallSchema).mutation(({ ctx, input }) => {
		return ctx.db.insert(ToolCall).values(input);
	}),

	delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
		return ctx.db.delete(ToolCall).where(eq(ToolCall.id, input));
	}),
} satisfies TRPCRouterRecord;
