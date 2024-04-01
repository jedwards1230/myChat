import { AppDataSource } from "@/lib/pg";
import { User } from "@/modules/User/UserModel";

export const getUserRepo = () => AppDataSource.getRepository(User).extend({});
