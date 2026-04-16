// src/app/(private)/clients/page.tsx
import { getClientsPageData } from "@/lib/clients";
import { ClientsPage } from "@/ui/pages/privatePages/ClientsPage";
import { resolveLocale } from "@/utils/i18n";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : undefined;

  const q = typeof params?.q === "string" ? params.q : "";
  const statusRaw = typeof params?.status === "string" ? params.status : "all";
  const recurringRaw =
    typeof params?.recurring === "string" ? params.recurring : "all";

  const status =
    statusRaw === "active" || statusRaw === "inactive" ? statusRaw : "all";
  const recurring = recurringRaw === "yes" ? "yes" : "all";

  const locale = await resolveLocale();
  const data = await getClientsPageData({ q, status, recurring }, locale);

  return <ClientsPage data={data} />;
}
