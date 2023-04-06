import { createTRPCRouter } from "~/server/api/trpc";
import {addMediaRouter} from "./routers/addMedia";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  addMedia: addMediaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
