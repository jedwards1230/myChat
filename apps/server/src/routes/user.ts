import type { FastifyInstance } from "fastify";

import { logger } from "@/lib/logger";
import { getUser } from "@/hooks/getUser";
import { AuthInputSchema, UserSchema } from "@mychat/shared/schemas/User";
import { UserSessionSchema } from "@mychat/shared/schemas/Session";
import { UserSession } from "@mychat/db/entity/Session";
import { pgRepo } from "@/lib/pg";

export async function setupUserRoute(app: FastifyInstance) {
	app.post("/user", {
		schema: {
			description: "Create user",
			tags: ["User"],
			body: AuthInputSchema,
			response: { 200: UserSchema },
		},
		handler: async (request, reply) => {
			const { email, password } = request.body as AuthInputSchema;

			try {
				const emailedAlreadyStored = await pgRepo["User"].findOne({
					where: { email },
				});
				if (emailedAlreadyStored)
					return reply
						.code(409)
						.send({ error: "User with this email already exists" });

				const agent = await pgRepo["Agent"].save({});
				if (!agent) throw new Error("Cannot load default agent");

				const baseUser = await pgRepo["User"].save({
					apiKey: "user-1",
					email,
					password,
					agents: [agent],
					defaultAgent: agent,
				});
				if (!baseUser)
					return reply.code(409).send({ error: "Cannot create user" });

				return reply.send(baseUser);
			} catch (error) {
				logger.error("Error creating user", error);
				return reply.code(409).send({ error: "Cannot create user" });
			}
		},
	});

	await app.register(async (app) => {
		app.addHook("preHandler", getUser);

		app.get("/user", {
			schema: {
				description: "Get the current user",
				tags: ["User"],
				response: { 200: UserSchema },
			},
			handler: async (request, reply) => reply.send(request.user),
		});

		app.get("/user/:userId", {
			schema: {
				description: "Get user by ID",
				tags: ["User"],
				response: { 200: UserSchema },
			},
			handler: async (request, reply) => reply.send(request.user),
		});

		app.get("/user/session", {
			schema: {
				description: "Get user session by ID",
				tags: ["User"],
				response: { 200: UserSchema },
			},
			handler: async (request, reply) => reply.send(request.user),
		});
	});

	app.post("/user/session", {
		schema: {
			description: "Create user session by ID",
			tags: ["User"],
			response: { 200: UserSessionSchema },
		},
		handler: async (request, reply) => {
			const { email, password } = request.body as AuthInputSchema;

			// Validate user credentials
			const user = await pgRepo["User"].findOne({ where: { email, password } });
			if (!user) {
				return reply.status(401).send({ error: "Invalid credentials" });
			}

			const session = await pgRepo["UserSession"].save({
				user,
				createdAt: new Date(),
				expire: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
				ip: request.ip,
				provider: "email",
			});

			logger.verbose(`Session created: ${session.id}`, {
				functionName: "POST /user/session",
			});
			return reply.send({ ...session, userId: user.id });
		},
	});

	// Get a session
	app.get("/user/session/:sessionId", {
		schema: {
			description: "Get a user session by ID",
			tags: ["User"],
			response: { 200: UserSessionSchema },
		},
		handler: async (request, reply) => {
			const { sessionId } = request.params as { sessionId: string };
			const session = await UserSession.findOne({
				where: { id: sessionId },
				relations: ["user"],
			});

			if (!session) {
				return reply.status(401).send({ error: "Session not found" });
			}

			// check if expired
			if (session.expire < new Date()) {
				logger.verbose(`Session expired: ${session.id}`, {
					functionName: "GET /user/session/:sessionId",
				});
				await session.remove();
				return reply.status(401).send({ error: "Session expired" });
			}

			return reply.send({ ...session, userId: session.user.id });
		},
	});

	// Delete a session
	app.delete("/user/session/:sessionId", {
		schema: {
			description: "Delete a user session by ID",
			tags: ["User"],
			//response: { 200: UserSessionSchema },
		},
		handler: async (request, reply) => {
			const { sessionId } = request.params as { sessionId: string };
			const session = await UserSession.findOne({ where: { id: sessionId } });

			if (!session) {
				return reply.status(404).send({ error: "Session not found" });
			}

			await session.remove();
			return reply.send({ message: "Session deleted" });
		},
	});
}
