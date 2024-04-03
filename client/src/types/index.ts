export type { Message } from "@db/Message/MessageModel";
export type { MessageObjectSchema as MessageSchema } from "@db/Message/MessageSchema";
export type { ThreadSchema as Thread } from "@db/Thread/ThreadSchema";
export type { UserSchema as User } from "@db/User/UserSchema";

export type {
	AgentObjectSchema as Agent,
	AgentCreateSchema,
} from "@db/Agent/AgentSchema";

export type { MessageFile } from "@db/MessageFile/MessageFileModel";

export type CacheFile = {
	name: string;
	size?: number | undefined;
	uri: string;
	mimeType?: string | undefined;
	lastModified?: number | undefined;
	file?: File | undefined;
	relativePath?: string;
};
