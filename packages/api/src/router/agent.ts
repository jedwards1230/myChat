import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@mychat/db";
import { Agent, CreateAgentSchema } from "@mychat/db/schema";
import { modelList } from "@mychat/db/schema/models/chat";
import { Tools } from "@mychat/db/schema/tools";

import { protectedProcedure, publicProcedure } from "../trpc";

export const agentRouter = {
	all: publicProcedure.query(({ ctx }) => {
		// return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
		return ctx.db.query.Agent.findMany({
			orderBy: desc(Agent.id),
			limit: 10,
		});
	}),

	byId: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
		// return ctx.db
		//   .select()
		//   .from(schema.post)
		//   .where(eq(schema.post.id, input.id));
		return ctx.db.query.Agent.findFirst({
			where: eq(Agent.id, input.id),
			with: { owner: true, threads: true, tools: true },
		});
	}),

	create: protectedProcedure.input(CreateAgentSchema).mutation(({ ctx, input }) => {
		return ctx.db.insert(Agent).values(input);
	}),

	getTools: publicProcedure.query(() => {
		return Tools.map((tool) => tool.name);
	}),

	edit: protectedProcedure
		.input(z.object({ id: z.string(), data: CreateAgentSchema }))
		.mutation(({ ctx, input }) => {
			return ctx.db.update(Agent).set(input.data).where(eq(Agent.id, input.id));
		}),

	models: publicProcedure.query(() => {
		return modelList;
	}),

	delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
		return ctx.db.delete(Agent).where(eq(Agent.id, input));
	}),
} satisfies TRPCRouterRecord;
