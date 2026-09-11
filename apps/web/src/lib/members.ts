import "server-only";

import prisma from "@/lib/prisma";
import type { AppLocale } from "@/utils/i18n";
import {
  formatDateLabel,
  formatRoleLabel,
  type MemberRow,
  type OrgMemberRole,
} from "./members-utils";

export type { MemberRow, OrgMemberRole };
export { formatRoleLabel };

export async function getOrganizationMembers(
  orgId: string,
  currentUserId: string,
  locale: AppLocale = "pt-BR",
): Promise<MemberRow[]> {
  const memberships = await prisma.membership.findMany({
    where: { orgId },
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return memberships.map((m) => ({
    id: m.id,
    userId: m.userId,
    name: m.user.name,
    email: m.user.email,
    role: m.role as OrgMemberRole,
    roleLabel: formatRoleLabel(m.role as OrgMemberRole, locale),
    joinedAtLabel: formatDateLabel(m.createdAt, locale),
    isCurrentUser: m.userId === currentUserId,
  }));
}
