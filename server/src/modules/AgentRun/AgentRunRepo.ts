import { AppDataSource } from "@/lib/pg";
import { AgentRun } from "./AgentRunModel";

export const getAgentRunRepo = () => AppDataSource.getTreeRepository(AgentRun).extend({});
