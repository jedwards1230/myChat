import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import fastifyORM from "typeorm-fastify-plugin";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { Config } from "./config";
import { initDb, resetDatabase, AppDataSource } from "./lib/pg";
import { errorHandler } from "./errors";

import { getUser } from "./hooks/getUser";
import { accessErrorLogger, accessLogger } from "./hooks/accessLogger";

import { setupUserRoute } from "./routes/user";
import { setupAgentsRoute } from "./routes/agents";
import { setupMessagesRoute } from "./routes/threads/messages";
import { setupThreadsRoute } from "./routes/threads/threads";
import { setupAgentRunsRoute } from "./routes/threads/runs";
import { setupServerRoute } from "./routes/server";
import { setupModelsRoute } from "./routes/models";

export const app = Fastify({
    logger: false,
    ...Config.sslOptions,
});

export type BuildAppParams = {
    resetDbOnInit: boolean;
    staticClientFilesDir: string;
};

export async function buildApp(
    { resetDbOnInit, staticClientFilesDir }: BuildAppParams | undefined = {
        resetDbOnInit: Config.resetDbOnInit,
        staticClientFilesDir: Config.staticClientFilesDir,
    }
) {
    // Connect to Postgres and initialize TypeORM
    if (resetDbOnInit) {
        await initDb();
        await resetDatabase();
    }
    await app.register(fastifyORM, { connection: AppDataSource });

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.withTypeProvider<ZodTypeProvider>();

    // Hooks
    await app.register(fastifyMultipart);
    app.register(fastifySwagger, {
        openapi: {
            openapi: "3.0.0",
            info: {
                title: "myChat API",
                description: "Sample backend service",
                version: "0.1.0",
            },
            servers: [],
        },
        transform: jsonSchemaTransform,
    });

    app.register(fastifySwaggerUI, {
        routePrefix: "/docs",
    });
    await app.register(fastifyCors, { origin: "*" });

    // Access Logger
    app.addHook("onRequest", accessLogger);
    app.addHook("onSend", accessErrorLogger);

    app.setErrorHandler(errorHandler);

    // Api Routes
    await app.register(
        async (app) => {
            await app.register(setupServerRoute);
            await app.register(setupUserRoute);
            await app.register(setupModelsRoute);

            await app.register(async (app) => {
                app.addHook("preHandler", getUser);

                await app.register(setupAgentsRoute, { prefix: "/agents" });
                await app.register(setupThreadsRoute, { prefix: "/threads" });
                await app.register(setupAgentRunsRoute, { prefix: "/threads" });
                await app.register(setupMessagesRoute, {
                    prefix: "threads/:threadId/messages",
                });
            });
        },
        { prefix: "/api" }
    );

    await app.register(fastifyStatic, {
        root: staticClientFilesDir,
        prefix: "/",
    });

    return app;
}
