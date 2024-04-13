import { Equal, type FindOneOptions } from "typeorm";

import { AppDataSource } from "@/lib/pg";
import type { User } from "@/modules/User/UserModel";
import { Agent } from "./AgentModel";

export const getAgentRepo = () =>
	AppDataSource.getRepository(Agent).extend({
		async getAgentById(
			user: User,
			id: string,
			relations?: FindOneOptions<Agent>["relations"]
		) {
			return this.findOne({
				where: { id, owner: Equal(user.apiKey) },
				relations,
			});
		},
	});
