import { buildDbLogger } from "@mychat/logger/db";
import path from "path";

const DIR_NAME = "../logs";
const LOGS_DIR = path.normalize(path.join(__dirname, DIR_NAME));

export const { logger, typeormLogger } = buildDbLogger(LOGS_DIR);
