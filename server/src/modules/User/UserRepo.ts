import { AppDataSource } from "@/lib/pg";
import { User } from "@/modules/User/UserModel";
import { SocketSession } from "@/modules/User/SessionModel";

export const getUserRepo = () =>
	AppDataSource.getRepository(User).extend({
		getUserById(id: string | undefined) {
			return this.findOne({
				where: { id },
				relations: ["threads", "agents"],
			});
		},

		async createSocketSession(user: User) {
			return SocketSessionRepo.save(SocketSessionRepo.create({ user }));
		},
	});

export const SocketSessionRepo = AppDataSource.getRepository(SocketSession);
