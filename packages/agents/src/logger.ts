import path from "path";

import { buildServerLogger } from "@mychat/logger/server";

const DIR_NAME = "../logs";
const LOGS_DIR = path.normalize(path.join(__dirname, DIR_NAME));

export const { logger, streamLogger, accessLogger } = buildServerLogger(LOGS_DIR);
