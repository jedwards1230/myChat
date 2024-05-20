import type { InferResultType } from "./utils";

export * from "./agentRun";
export * from "./message";
export * from "./messageFile";

export type Document = InferResultType<"DatabaseDocument">;

// Demo setup
/* const userRelations = {
	defaultAgent: true,
	documents: true,
} as const;
type UserRelations = typeof userRelations;

const threadRelations = {
	activeMessage: { with: { files: { with: { fileData: true } } } },
} as const;
type ThreadRelations = typeof threadRelations;

// Usages
export type TypedUserWithPosts = InferResultType<"User", UserRelations>;
export type UserWithPosts = InferResultType<"User", { defaultAgent: true }>;

export type ThreadWithRelations = InferResultType<"Thread", ThreadRelations>;

export type UserNameAndEmailWithRelations = InferQueryModel<
	"User",
	{ name: true; email: true },
	UserRelations
>;

export type UserTest = InferQueryModel<
	"User",
	{
		id: true;
		name: true;
		email: true;
		nonExistentKey: true; // This doesnt throw an error
	}
>; */
