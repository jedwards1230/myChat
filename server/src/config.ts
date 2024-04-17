import path from "path";
import type { LogLevel } from "typeorm";

const isProd = process.env.NODE_ENV === "production";
const resetDbOnInit = process.env.DEBUG_RESET_DB === "true";
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const sessionSecret = process.env.SESSION_SECRET || "secret";

const database = {
	type: "postgres",
	host: process.env.DB_HOST || "localhost",
	port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
	username: process.env.DB_USER || "admin",
	password: process.env.DB_PASSWORD || "admin",
	database: process.env.DB_NAME || "ChatDB",
	logging: process.env.DB_DEBUG ? "all" : (["error", "warn"] as LogLevel[]),
} as const;

const staticClientFilesDir = path.resolve(
	process.cwd(),
	process.env.CLIENT_BUILD_DIR || "../client/dist"
);

const SSL_ENABLED = process.env.SSL_ENABLED === "true";
const SSL_DIR = path.join(process.cwd(), "ssl");
const SSL_KEY_PATH = path.join(SSL_DIR, "key.pem");
const SSL_CERT_PATH = path.join(SSL_DIR, "cert.pem");

const sslOptions = {
	key: SSL_ENABLED ? SSL_KEY_PATH : undefined,
	cert: SSL_ENABLED ? SSL_CERT_PATH : undefined,
};

export const Config = {
	isProd,
	sessionSecret,
	staticClientFilesDir,
	database,
	port,
	sslOptions,
	resetDbOnInit,
} as const;
