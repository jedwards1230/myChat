//import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as agent from "./schema/agent";
import * as agentRun from "./schema/agentRun";
import * as agentTool from "./schema/agentTool";
import * as document from "./schema/document";
import * as message from "./schema/message";
import * as messageFile from "./schema/messageFile";
import * as thread from "./schema/thread";
import * as toolCall from "./schema/toolCall";
import * as user from "./schema/user";

if (!process.env.DB_URL) {
	throw new Error("DB_URL environment variable is required");
}

const queryClient = postgres(process.env.DB_URL);

/* const migrationClient = postgres("postgres://postgres:adminadmin@0.0.0.0:5432/db", {
	max: 1,
});
await migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" }); */

export const db = drizzle(queryClient, {
	schema: {
		...agent,
		...agentRun,
		...agentTool,
		...document,
		...message,
		...messageFile,
		...thread,
		...toolCall,
		...user,
	},
});
