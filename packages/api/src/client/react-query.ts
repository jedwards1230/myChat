import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "../root";

/**
 * A set of typesafe hooks for consuming your API.
 */
const api = createTRPCReact<AppRouter>();

/**
 * Inference helpers for input types
 * @example
 * type PostByIdInput = RouterInputs['post']['byId']
 *      ^? { id: number }
 **/
type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helpers for output types
 * @example
 * type AllPostsOutput = RouterOutputs['post']['all']
 *      ^? Post[]
 **/
type RouterOutputs = inferRouterOutputs<AppRouter>;

export { api };
export type { RouterInputs, RouterOutputs };
