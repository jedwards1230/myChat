import type { Config } from "drizzle-kit";

import env from "./src/env";

export default {
	schema: "./src/schema/index.ts",
	out: "./src/migrations",
	dialect: "postgresql",
	dbCredentials: { url: env.DATABASE_URL ?? "" },
	verbose: true,
	strict: true,
} satisfies Config;
