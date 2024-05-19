import { bigint, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const migrations = pgTable("migrations", {
	id: serial("id").primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	timestamp: bigint("timestamp", { mode: "number" }).notNull(),
	name: varchar("name").notNull(),
});
