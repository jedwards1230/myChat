import { Type, type Static } from "@fastify/type-provider-typebox";

export const PostChatBody = Type.Object({ stream: Type.Optional(Type.Boolean()) });
export type PostChatBody = Static<typeof PostChatBody>;
