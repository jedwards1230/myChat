import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
	getSession: publicProcedure.query(({ ctx }) => {
		//return ctx.session;
		console.log(">>> TODO getSession", ctx);
		return null;
	}),
	getSecretMessage: protectedProcedure.query(() => {
		return "you can see this secret message!";
	}),
} satisfies TRPCRouterRecord;
