import { buildServerLogger } from "@mychat/logger/server";
import path from "path";

const DIR_NAME = "../../logs";
const SERVER_LOGS_DIR = path.normalize(path.join(__dirname, DIR_NAME));

export const { logger, streamLogger, accessLogger } = buildServerLogger(SERVER_LOGS_DIR);
