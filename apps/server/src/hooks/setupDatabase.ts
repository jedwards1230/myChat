import type { FastifyInstance } from "fastify";
import fastifyORM from "typeorm-fastify-plugin";
import fastifyPlugin from "fastify-plugin";

import { AppDataSource, initDb, resetDatabase } from "@mychat/db/index";

export const setupDatabase = fastifyPlugin(
	async (app: FastifyInstance, opts: { resetDbOnInit: boolean }) => {
		// Connect to Postgres and initialize TypeORM
		if (opts.resetDbOnInit) {
			await initDb();
			await resetDatabase();
		}
		await app.register(fastifyORM, { connection: AppDataSource });

		app.addHook("onReady", async () => {
			// seed database
		});
	}
);
