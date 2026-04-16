import "server-only";

import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { pickActiveOrganization } from "@/lib/tenant-utils";
import type { OrganizationSummary } from "@/types/base";
import { ACTIVE_ORG_COOKIE } from "@/utils/constants";

export const NO_ORG_ERROR_CODE = "NO_ORG";

export function isNoOrgError(error: unknown): boolean {
  return error instanceof Error && error.message === NO_ORG_ERROR_CODE;
}

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

async function listOrganizationsForUser(
  userId: string,
): Promise<OrganizationSummary[]> {
  const memberships = await prisma.membership.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: {
      role: true,
      org: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return memberships.map(({ org, role }) => ({
    id: org.id,
    name: org.name,
    role,
    slug: org.slug,
  }));
}

export async function getTenantContext(userIdFromCaller?: string): Promise<{
  userId: string;
  orgId: string;
  org: OrganizationSummary;
  organizations: OrganizationSummary[];
}> {
  const userId = userIdFromCaller ?? (await requireUserId());
  const organizations = await listOrganizationsForUser(userId);

  const cookieStore = await cookies();
  const preferredOrgId = cookieStore.get(ACTIVE_ORG_COOKIE)?.value;
  const org = pickActiveOrganization(organizations, preferredOrgId);

  if (!org) {
    throw new Error(NO_ORG_ERROR_CODE);
  }

  return {
    userId,
    orgId: org.id,
    org,
    organizations,
  };
}

export async function requireOrgId(): Promise<{
  userId: string;
  orgId: string;
}> {
  const { userId, orgId } = await getTenantContext();
  return { userId, orgId };
}
