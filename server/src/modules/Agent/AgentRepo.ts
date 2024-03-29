import { Equal, type FindOneOptions } from "typeorm";

import { AppDataSource } from "@/lib/pg";
import type { User } from "@/modules/User/";
import { Agent } from "./AgentModel";

export const AgentRepo = AppDataSource.getRepository(Agent).extend({
	getAgentById: async (
		user: User,
		id: string,
		relations?: FindOneOptions<Agent>["relations"]
	) =>
		AgentRepo.findOne({
			where: { id, owner: Equal(user.id) },
			relations,
		}),
});
