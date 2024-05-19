import type { Config } from "drizzle-kit";

if (!process.env.DB_URL) {
	throw new Error("Missing DB_URL");
}

const nonPoolingUrl = process.env.DB_URL.replace(":6543", ":5432");

console.log("DB_URL:", nonPoolingUrl);

export default {
	schema: "./src/schema/*.ts",
	dialect: "postgresql",
	dbCredentials: { url: nonPoolingUrl },
	verbose: true,
	strict: true,
	out: "./drizzle",
} satisfies Config;
