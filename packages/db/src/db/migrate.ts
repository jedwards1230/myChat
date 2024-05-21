import { migrate } from "drizzle-orm/vercel-postgres/migrator";

import config from "../../drizzle.config";
import env from "../env";
import { db } from "./index";

if (!env.DB_MIGRATING) {
	throw new Error('You must set DB_MIGRATING to "true" when running migrations');
}

await migrate(db, { migrationsFolder: config.out });

//await connection.end();
