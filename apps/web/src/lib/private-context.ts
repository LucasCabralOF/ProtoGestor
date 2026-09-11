import "server-only";

import { getTenantContext } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";
import type { OrganizationSummary } from "@/types/base";

export type PrivatePageContext = {
  org: OrganizationSummary;
  organizations: OrganizationSummary[];
  user: {
    email: string | null;
    id: string;
    name: string;
  };
};

export async function getPrivatePageContext(): Promise<PrivatePageContext> {
  const { userId, org, organizations } = await getTenantContext();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  return {
    org,
    organizations,
    user: {
      id: userId,
      name: user?.name ?? "User",
      email: user?.email ?? null,
    },
  };
}
