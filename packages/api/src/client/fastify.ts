import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

import { db } from "@mychat/db/client";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export function createTRPCContextFastify({ req, res }: CreateFastifyContextOptions) {
	const source = req.headers["x-trpc-source"] ?? "unknown";

	//console.log(">>> tRPC Request from", source, "by", session?.user);
	console.log(">>> tRPC Request from", source);

	//const user = { name: req.headers.username ?? "anonymous" };
	return { req, res, db };
}
export type ContextFastify = Awaited<ReturnType<typeof createTRPCContextFastify>>;
