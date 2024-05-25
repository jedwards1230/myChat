import { routers } from "./router/";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter(routers);

// export type definition of API
export type AppRouter = typeof appRouter;
