import { notFound } from "next/navigation";
import { getClientDetailsData } from "@/lib/client-details";
import { getPrivatePageContext } from "@/lib/private-context";
import { ClientDetailsPage } from "@/ui/pages/privatePages/ClientDetailsPage";
import { resolveLocale } from "@/utils/i18n";

export default async function ClientDetailsRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) {
    notFound();
  }

  const [{ org }, locale] = await Promise.all([
    getPrivatePageContext(),
    resolveLocale(),
  ]);

  const client = await getClientDetailsData(id, locale);
  if (!client) {
    notFound();
  }

  return (
    <ClientDetailsPage
      client={client}
      currentRole={org.role}
      orgName={org.name}
    />
  );
}
