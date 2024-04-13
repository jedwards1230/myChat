import type { FastifyInstance } from "fastify";

import logger from "@/lib/logs/logger";
import { authenticate } from "@/hooks/auth";
import { CreateUserSchema, UserSchema } from "@/modules/User/UserSchema";
import { UserSessionSchema } from "@/modules/User/SessionSchema";
import { UserSession } from "@/modules/User/SessionModel";
import { Agent } from "@/modules/Agent/AgentModel";
import { User } from "@/modules/User/UserModel";

export async function setupUserRoute(app: FastifyInstance) {
	app.get("/user", {
		schema: { response: { 200: UserSchema } },
		oas: { description: "Get the current user", tags: ["User"] },
		handler: async (request, reply) => {
			await authenticate(request, reply);
			reply.send(request.user);
		},
	});

	app.post("/user", {
		schema: { body: CreateUserSchema, response: { 200: UserSchema } },
		oas: { description: "Create user", tags: ["User"] },
		handler: async (request, reply) => {
			const { email, password } = request.body as CreateUserSchema;

			try {
				const agent = await app.orm.getRepository(Agent).save({});
				if (!agent) throw new Error("Cannot preload agent");

				const baseUser = await app.orm.getRepository(User).save({
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

	app.get("/user/:userId", {
		schema: { response: { 200: UserSchema } },
		oas: { description: "Get user by ID", tags: ["User"] },
		handler: async (request, reply) => {
			await authenticate(request, reply);
			return reply.send(request.user);
		},
	});

	app.get("/user/session", {
		schema: { response: { 200: UserSchema } },
		oas: { description: "Get user session by ID", tags: ["User"] },
		handler: async (request, reply) => {
			await authenticate(request, reply);
			return reply.send(request.user);
		},
	});

	app.post("/user/session", {
		schema: { response: { 200: UserSessionSchema } },
		oas: { description: "Create user session by ID", tags: ["User"] },
		handler: async (request, reply) => {
			const { email, password } = request.body as CreateUserSchema;

			// Validate user credentials
			const user = await app.orm
				.getRepository(User)
				.findOne({ where: { email, password } });
			if (!user) {
				return reply
					.status(401)
					.send({ success: false, message: "Invalid credentials" });
			}

			logger.debug("User logged in", { email, password, request });

			const session = await app.orm.getRepository(UserSession).save({
				user,
				createdAt: new Date(),
				expire: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
				ip: request.ip,
				provider: "email",
			});

			logger.debug("Session created", { session });

			// Set cookie with the session ID
			reply.setCookie("sessionId", session.id, {
				path: "/",
				secure: true, // Set to true in production (HTTPS)
				httpOnly: true,
				sameSite: "lax", // CSRF protection
			});

			logger.debug("Session cookie set");

			return reply.send({ ...session, userId: user.id });
		},
	});

	// Delete a session
	app.delete("/user/session/:sessionId", async (request, reply) => {
		const { sessionId } = request.params as { sessionId: string };
		const session = await UserSession.findOne({ where: { id: sessionId } });

		if (!session) {
			return reply
				.status(404)
				.send({ success: false, message: "Session not found" });
		}

		await session.remove();
		reply
			.clearCookie("sessionId", { path: "/" })
			.send({ success: true, message: "Session deleted" });
	});
}
