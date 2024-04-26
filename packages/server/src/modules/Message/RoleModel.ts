export type Role = "system" | "user" | "assistant" | "tool";

export enum RoleEnum {
	System = "system",
	User = "user",
	Assistant = "assistant",
	Tool = "tool",
}

export const roleList = ["system", "user", "assistant", "tool"] as const;
