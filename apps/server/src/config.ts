import path from "path";

const isProd = process.env.NODE_ENV === "production";
const resetDbOnInit = process.env.DEBUG_RESET_DB === "true";
const port = process.env.PORT ? parseInt(process.env.PORT) : 3050;
const sessionSecret = process.env.SESSION_SECRET ?? "secret";

const staticClientFilesDir = path.resolve(
	process.cwd(),
	process.env.CLIENT_BUILD_DIR ?? "../native/dist",
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
	port,
	sslOptions,
	resetDbOnInit,
} as const;
