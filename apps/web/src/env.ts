import { z, ZodError } from "zod";

const EnvSchema = z.object({
	NODE_ENV: z.string().default("development"),
	VERCEL_URL: z.string().optional(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

try {
	EnvSchema.parse(process.env);
} catch (error) {
	if (error instanceof ZodError) {
		console.log(error.issues);
		let message = "Missing required values in .env:\n";
		console.error(message);
		error.issues.forEach((issue) => {
			message += issue.path[0] + "\n";
		});
		const e = new Error(message);
		e.stack = "";
		throw e;
	} else {
		console.error("Error parsing .env file");
		console.error(error);
	}
}

export default EnvSchema.parse(process.env);
