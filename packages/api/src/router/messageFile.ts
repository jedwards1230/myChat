import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@mychat/db";
import { CreateMessageFileSchema, MessageFile } from "@mychat/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const messageFileRouter = {
	all: publicProcedure.query(({ ctx }) => {
		// return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
		return ctx.db.query.MessageFile.findMany({
			orderBy: desc(MessageFile.id),
			limit: 10,
		});
	}),

	byId: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
		// return ctx.db
		//   .select()
		//   .from(schema.post)
		//   .where(eq(schema.post.id, input.id));
		return ctx.db.query.MessageFile.findFirst({
			where: eq(MessageFile.id, input.id),
		});
	}),

	create: protectedProcedure
		.input(CreateMessageFileSchema)
		.mutation(({ ctx, input }) => {
			return ctx.db.insert(MessageFile).values(input);
		}),

	delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
		return ctx.db.delete(MessageFile).where(eq(MessageFile.id, input));
	}),
} satisfies TRPCRouterRecord;
