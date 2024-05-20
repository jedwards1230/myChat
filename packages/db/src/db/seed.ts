import type { Table } from "drizzle-orm";
import { getTableName, sql } from "drizzle-orm";

import env from "../env";
import { connection, db } from "./index";
import * as schema from "./schema";

//import * as seeds from "./seeds";

if (!env.DB_SEEDING) {
	throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

async function resetTable(db: db, table: Table) {
	return db.execute(
		sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`),
	);
}

for (const table of [
	schema.Agent,
	schema.AgentRun,
	schema.AgentTool,
	schema.DatabaseDocument,
	schema.EmbedItem,
	schema.Message,
	schema.MessageClosure,
	schema.MessageFile,
	schema.Thread,
	schema.ToolCall,
	schema.User,
	schema.UserSession,
]) {
	// await db.delete(table); // clear tables without truncating / resetting ids
	await resetTable(db, table);
}

/* await seeds.category(db);
await seeds.statusCatalog(db);
await seeds.state(db);
await seeds.city(db);
await seeds.restaurant(db);
await seeds.user(db);
await seeds.order(db); */

await connection.end();
