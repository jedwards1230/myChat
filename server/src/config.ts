import path from "path";
import type { LogLevel } from "typeorm";

const isProd = process.env.NODE_ENV === "production";

const resetDbOnInit = process.env.RESET_DB === "true";
const debugDb = process.env.DEBUG_DB === "true";

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const database = {
	type: "postgres",
	host: process.env.DB_HOST || "localhost",
	port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
	username: process.env.DB_USER || "admin",
	password: process.env.DB_PASSWORD || "admin",
	database: process.env.DB_NAME || "ChatDB",
	logging: debugDb ? "all" : (["error", "warn"] as LogLevel[]),
} as const;

const _clientBuildDir = process.env.CLIENT_BUILD_DIR || "../client/dist";
const CLIENT_BUILD_DIR = path.join(process.cwd(), _clientBuildDir);

const directories = {
	clientBuild: CLIENT_BUILD_DIR,
};

// ssl
const SSL_ENABLED = process.env.SSL_ENABLED === "true";

const SSL_DIR = path.join(process.cwd(), "ssl");
const SSL_KEY_PATH = path.join(SSL_DIR, "key.pem");
const SSL_CERT_PATH = path.join(SSL_DIR, "cert.pem");

const SSL_KEY = SSL_ENABLED ? SSL_KEY_PATH : undefined;
const SSL_CERT = SSL_ENABLED ? SSL_CERT_PATH : undefined;

const sslOptions = {
	key: SSL_KEY,
	cert: SSL_CERT,
};

export const Config = {
	isProd,
	directories,
	database,
	port,
	debugDb,
	sslOptions,
	resetDbOnInit,
} as const;
