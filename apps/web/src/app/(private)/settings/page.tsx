import { cookies } from "next/headers";
import { getOrganizationMembers } from "@/lib/members";
import { getPrivatePageContext } from "@/lib/private-context";
import { SettingsPage } from "@/ui/pages/privatePages/SettingsPage";
import { DEFAULT_LOCALE, type LocaleKey } from "@/utils/constants";

export default async function SettingsRoute() {
  const { org, organizations, user } = await getPrivatePageContext();
  const cookieStore = await cookies();
  const locale =
    (cookieStore.get("NEXT_LOCALE")?.value as LocaleKey) || DEFAULT_LOCALE;

  const members = await getOrganizationMembers(org.id, user.id, locale);

  return (
    <SettingsPage
      activeOrgId={org.id}
      activePlan={org.plan}
      currentRole={org.role}
      members={members}
      orgName={org.name}
      orgSlug={org.slug}
      organizations={organizations}
      trialEndsAtIso={org.trialEndsAt ? org.trialEndsAt.toISOString() : null}
      userEmail={user.email}
      userName={user.name}
    />
  );
}
