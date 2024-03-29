import { AppDataSource } from "@/lib/pg";
import { SocketSession, User } from "@/modules/User";

export const UserRepo = AppDataSource.getRepository(User).extend({
	getUserById(id: string | undefined) {
		return this.findOne({
			where: { id },
			relations: ["threads", "agents"],
			cache: true,
		});
	},

	async createSocketSession(user: User) {
		return SocketSessionRepo.save(SocketSessionRepo.create({ user }));
	},
});

export const SocketSessionRepo = AppDataSource.getRepository(SocketSession);
