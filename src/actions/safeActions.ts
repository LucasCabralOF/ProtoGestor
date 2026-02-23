import "server-only";

import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const actionClient = createSafeActionClient({
  handleServerError(err) {
    return err instanceof Error ? err.message : "UNKNOWN_ERROR";
  },
});

export function createPublicAction() {
  return actionClient;
}

export function createPrivateAction() {
  return actionClient.use(async ({ next }) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("UNAUTHORIZED");
    return next({ ctx: { session } });
  });
}