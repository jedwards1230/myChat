export type { ThreadSchema as Thread } from "@db/Thread/ThreadSchema";
export type { UserSchema as User } from "@db/User/UserSchema";

export type {
	AgentObjectSchema as Agent,
	AgentCreateSchema,
} from "@db/Agent/AgentSchema";
export type { MessageObjectSchema as Message } from "@db/Message/MessageSchema";

export type { MessageFileObjectSchema as MessageFile } from "@db/MessageFile/MessageFileSchema";

export type CacheFile = {
	name: string;
	size?: number | undefined;
	uri: string;
	mimeType?: string | undefined;
	lastModified?: number | undefined;
	file?: File | undefined;
	relativePath?: string;
};
