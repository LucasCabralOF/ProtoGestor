// src/lib/auth-tenant.ts
import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

function headersToObject(h: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  h.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

export async function requireUserId(): Promise<string> {
  const h = await headers();
  const session = await auth.api.getSession({ headers: headersToObject(h) });

  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("UNAUTHENTICATED");
  }

  return userId;
}

export async function requireOrgId(): Promise<{
  userId: string;
  orgId: string;
}> {
  const userId = await requireUserId();

  const m = await prisma.membership.findFirst({
    where: { userId },
    select: { orgId: true },
  });

  if (!m?.orgId) {
    throw new Error("NO_ORG");
  }

  return { userId, orgId: m.orgId };
}
