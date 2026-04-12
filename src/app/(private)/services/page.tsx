import { getServicesPageData } from "@/lib/services";
import { ServicesPage } from "@/ui/pages/privatePages/ServicesPage";
import { resolveLocale } from "@/utils/i18n";

export default async function ServicesRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : undefined;

  const q = typeof params?.q === "string" ? params.q : "";
  const customerId =
    typeof params?.customerId === "string" ? params.customerId : "";
  const statusRaw = typeof params?.status === "string" ? params.status : "all";

  const status =
    statusRaw === "draft" ||
    statusRaw === "scheduled" ||
    statusRaw === "in_progress" ||
    statusRaw === "completed" ||
    statusRaw === "canceled"
      ? statusRaw
      : "all";

  const locale = await resolveLocale();
  const data = await getServicesPageData(
    {
      q,
      status,
      customerId,
    },
    locale,
  );

  return <ServicesPage data={data} />;
}
