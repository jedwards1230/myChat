import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "../trpc";

export const adminRouter = {
	ping: publicProcedure.query(() => "pong"),
	// add your procedures here

	resetDb: protectedProcedure.mutation(() => {
		throw new Error("Not implemented");
	}),
} satisfies TRPCRouterRecord;
