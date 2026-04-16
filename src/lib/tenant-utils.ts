import type { OrganizationSummary } from "@/types/base";

export function pickActiveOrganization(
  organizations: OrganizationSummary[],
  preferredOrgId?: string | null,
): OrganizationSummary | null {
  if (organizations.length === 0) {
    return null;
  }

  return (
    organizations.find((organization) => organization.id === preferredOrgId) ??
    organizations[0]
  );
}
