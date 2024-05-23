import { z, ZodError } from "zod";

const stringBoolean = z.coerce
	.string()
	.transform((val) => val === "true")
	.default("false");

const EnvSchema = z.object({
	NODE_ENV: z.string().default("development"),
	DATABASE_URL: z.string().default("postgres://localhost:5432/mychat"),
	DB_MIGRATING: stringBoolean,
	DB_SEEDING: stringBoolean,
});

export type EnvSchema = z.infer<typeof EnvSchema>;

try {
	EnvSchema.parse(process.env);
} catch (error) {
	if (error instanceof ZodError) {
		let message = "Missing required values in .env:\n";
		error.issues.forEach((issue) => {
			message += issue.path[0] + "\n";
		});
		const e = new Error(message);
		e.stack = "";
		throw e;
	} else {
		console.error(error);
	}
}

export default EnvSchema.parse(process.env);
