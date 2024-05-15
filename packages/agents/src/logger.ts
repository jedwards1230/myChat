import { buildServerLogger } from "@mychat/logger/server";

export const { logger, streamLogger, accessLogger } = buildServerLogger();
