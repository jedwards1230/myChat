import { getLogger, DBLogger } from "@mychat/logger";

const prefix = "db";

export const logger = getLogger({ type: "common", prefix });
export const typeormLogger = new DBLogger(getLogger({ type: "db", prefix }));
