import type { z } from "zod";

export function isValidZodLiteralUnion<T extends z.ZodLiteral<unknown>>(
	literals: T[],
): literals is [T, T, ...T[]] {
	return literals.length >= 2;
}
