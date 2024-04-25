import { z, type Primitive } from "zod";

export function isValidZodLiteralUnion<T extends z.ZodLiteral<unknown>>(
	literals: T[]
): literals is [T, T, ...T[]] {
	return literals.length >= 2;
}

export function constructZodLiteralUnionType<T extends Primitive>(
	constArray: readonly T[]
) {
	const literalsArray = constArray.map((literal) => z.literal(literal));
	if (!isValidZodLiteralUnion(literalsArray)) {
		throw new Error(
			"Literals passed do not meet the criteria for constructing a union schema, the minimum length is 2"
		);
	}
	return z.union(literalsArray);
}
