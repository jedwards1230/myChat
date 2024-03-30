import { Type, type Static } from "@fastify/type-provider-typebox";

export const CreateRunBody = Type.Object({ stream: Type.Optional(Type.Boolean()) });
export type CreateRunBody = Static<typeof CreateRunBody>;
