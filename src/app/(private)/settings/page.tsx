import { getPrivatePageContext } from "@/lib/private-context";
import { SettingsPage } from "@/ui/pages/privatePages/SettingsPage";

export default async function SettingsRoute() {
  const { org, user } = await getPrivatePageContext();

  return (
    <SettingsPage
      orgName={org.name}
      orgSlug={org.slug}
      userEmail={user.email}
      userName={user.name}
    />
  );
}
