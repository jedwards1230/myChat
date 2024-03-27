import type { create } from "zustand";
import { DocumentPickerAsset } from "expo-document-picker";

export type { Thread } from "@db/Thread/ThreadModel";
export type { Message } from "@db/Message/MessageModel";
export type { MessageSchema } from "@db/Message/MessageSchema";
export type { User } from "@db/User/UserModel";

export type {
	AgentObjectSchema as Agent,
	AgentCreateSchema,
} from "@db/Agent/AgentSchema";

export type { MessageFile } from "@db/File/MessageFileModel";

export type { SocketClientMessage, SocketServerMessage } from "@bet/wsResponse";

type StoreType<T = unknown> = ReturnType<typeof create<T, any>>;
export type Setter<T = StoreType> = (fn: (state: T) => void) => void | Promise<void> | T;

export type CacheFile = DocumentPickerAsset;
