import type { Config } from "drizzle-kit";

import env from "./src/env";

export default {
	schema: "./src/db/schema/index.ts",
	out: "./src/db/migrations",
	dialect: "postgresql",
	dbCredentials: { url: env.DATABASE_URL },
	verbose: true,
	strict: true,
} satisfies Config;
