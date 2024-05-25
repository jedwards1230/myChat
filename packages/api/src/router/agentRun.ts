import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@mychat/db";
import { AgentRun, CreateAgentRunSchema } from "@mychat/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const agentRunRouter = {
	all: publicProcedure.query(({ ctx }) => {
		// return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
		return ctx.db.query.AgentRun.findMany({
			orderBy: desc(AgentRun.id),
			limit: 10,
		});
	}),

	byId: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
		// return ctx.db
		//   .select()
		//   .from(schema.post)
		//   .where(eq(schema.post.id, input.id));
		return ctx.db.query.AgentRun.findFirst({
			where: eq(AgentRun.id, input.id),
		});
	}),

	create: protectedProcedure.input(CreateAgentRunSchema).mutation(({ ctx, input }) => {
		return ctx.db.insert(AgentRun).values(input);
	}),

	delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
		return ctx.db.delete(AgentRun).where(eq(AgentRun.id, input));
	}),
} satisfies TRPCRouterRecord;
