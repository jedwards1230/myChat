import { AppDataSource } from "@/lib/pg";
import { User } from "@/modules/User/UserModel";
import { UserSession } from "./SessionModel";

export const getUserRepo = () => AppDataSource.getRepository(User).extend({});
export const getSessionRepo = () => AppDataSource.getRepository(UserSession).extend({});
