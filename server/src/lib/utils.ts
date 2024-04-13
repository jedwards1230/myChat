import logger from "@/lib/logs/logger";

import { getUserRepo } from "@/modules/User/UserRepo";
import { getAgentRepo } from "@/modules/Agent/AgentRepo";

/** Initialize user-1 and default Agent */
export async function init() {
	logger.info("Initializing App Controller");
	try {
		const agent = await getAgentRepo().save({});
		if (!agent) throw new Error("Cannot preload agent");

		const baseUser = await getUserRepo().save({
			apiKey: "user-1",
			agents: [agent],
			email: "",
			defaultAgent: agent,
		});
		if (!baseUser) throw new Error("Cannot preload user");

		logger.info("App Controller initialized");
	} catch (error) {
		logger.error("Error initializing App Controller", error);
	}
}
