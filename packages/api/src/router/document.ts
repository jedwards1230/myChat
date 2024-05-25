import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@mychat/db";
import { DatabaseDocument, DatabaseDocumentSchema } from "@mychat/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const databaseDocumentRouter = {
	all: publicProcedure.query(({ ctx }) => {
		// return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
		return ctx.db.query.DatabaseDocument.findMany({
			orderBy: desc(DatabaseDocument.id),
			limit: 10,
		});
	}),

	byId: publicProcedure.input(z.object({ id: z.number() })).query(({ ctx, input }) => {
		// return ctx.db
		//   .select()
		//   .from(schema.post)
		//   .where(eq(schema.post.id, input.id));
		return ctx.db.query.DatabaseDocument.findFirst({
			where: eq(DatabaseDocument.id, input.id),
		});
	}),

	create: protectedProcedure
		.input(DatabaseDocumentSchema)
		.mutation(({ ctx, input }) => {
			return ctx.db.insert(DatabaseDocument).values(input);
		}),

	delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
		return ctx.db.delete(DatabaseDocument).where(eq(DatabaseDocument.id, input));
	}),
} satisfies TRPCRouterRecord;
