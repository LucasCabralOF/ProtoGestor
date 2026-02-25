// src/app/(private)/clientes/page.tsx
import { getClientsPageData } from "@/lib/clients";
import { ClientsPage } from "@/ui/pages/privatePages/ClientsPage";

export default async function Page({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  const statusRaw =
    typeof searchParams?.status === "string" ? searchParams.status : "all";
  const recurringRaw =
    typeof searchParams?.recurring === "string"
      ? searchParams.recurring
      : "all";

  const status =
    statusRaw === "active" || statusRaw === "inactive" ? statusRaw : "all";
  const recurring = recurringRaw === "yes" ? "yes" : "all";

  const data = await getClientsPageData({ q, status, recurring });

  return <ClientsPage data={data} />;
}
