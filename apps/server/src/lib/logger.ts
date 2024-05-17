import { getLogger } from "@mychat/logger";

const prefix = "server";

export const logger = getLogger({ type: "common", prefix });
export const streamLogger = getLogger({ type: "stream", prefix });
export const accessLogger = getLogger({ type: "access", prefix });
