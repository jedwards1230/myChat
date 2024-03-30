import { DocumentPickerAsset } from "expo-document-picker";

export type { Message } from "@db/Message/MessageModel";
export type { MessageObjectSchema as MessageSchema } from "@db/Message/MessageSchema";
export type { ThreadSchema as Thread } from "@db/Thread/ThreadSchema";
export type { UserSchema as User } from "@db/User/UserSchema";

export type {
	AgentObjectSchema as Agent,
	AgentCreateSchema,
} from "@db/Agent/AgentSchema";

export type { MessageFile } from "@db/File/MessageFileModel";

export type { SocketClientMessage, SocketServerMessage } from "@bet/wsResponse";

export type CacheFile = DocumentPickerAsset & { relativePath?: string };
