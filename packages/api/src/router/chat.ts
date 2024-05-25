import type { TRPCRouterRecord } from "@trpc/server";

import { publicProcedure } from "../trpc";

export const chatRouter = {
	init: publicProcedure.mutation(() => {
		return {} as any;
	}),
} satisfies TRPCRouterRecord;
