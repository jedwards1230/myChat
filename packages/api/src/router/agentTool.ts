import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@mychat/db";
import { AgentTool, CreateAgentToolSchema } from "@mychat/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const agentToolRouter = {
	all: publicProcedure.query(({ ctx }) => {
		// return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
		return ctx.db.query.AgentTool.findMany({
			orderBy: desc(AgentTool.id),
			limit: 10,
		});
	}),

	byId: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
		// return ctx.db
		//   .select()
		//   .from(schema.post)
		//   .where(eq(schema.post.id, input.id));
		return ctx.db.query.AgentTool.findFirst({
			where: eq(AgentTool.id, input.id),
		});
	}),

	create: protectedProcedure.input(CreateAgentToolSchema).mutation(({ ctx, input }) => {
		return ctx.db.insert(AgentTool).values(input).returning();
	}),

	edit: protectedProcedure
		.input(z.object({ id: z.string(), data: CreateAgentToolSchema }))
		.mutation(({ ctx, input }) => {
			return ctx.db
				.update(AgentTool)
				.set(input.data)
				.where(eq(AgentTool.id, input.id))
				.returning();
		}),

	delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
		return ctx.db.delete(AgentTool).where(eq(AgentTool.id, input)).returning();
	}),
} satisfies TRPCRouterRecord;
