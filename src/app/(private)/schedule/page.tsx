import { getTenantContext } from "@/lib/auth-tenant";
import { getSchedulePageData } from "@/lib/schedule";
import type {
  AppointmentPeriod,
  AppointmentStatusFilter,
} from "@/lib/schedule";
import prisma from "@/lib/prisma";
import { SchedulePage } from "@/ui/pages/privatePages/SchedulePage";
import type { ServiceOrderOption } from "@/ui/pages/privatePages/AppointmentFormModal";
import { resolveLocale } from "@/utils/i18n";

export default async function ScheduleRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : undefined;

  const q = typeof params?.q === "string" ? params.q : "";
  const customerId =
    typeof params?.customerId === "string" ? params.customerId : "";

  const periodRaw =
    typeof params?.period === "string" ? params.period : "all";
  const period: AppointmentPeriod =
    periodRaw === "today" ||
    periodRaw === "week" ||
    periodRaw === "month" ||
    periodRaw === "all"
      ? periodRaw
      : "all";

  const statusRaw =
    typeof params?.status === "string" ? params.status : "all";
  const status: AppointmentStatusFilter =
    statusRaw === "scheduled" ||
    statusRaw === "done" ||
    statusRaw === "canceled"
      ? statusRaw
      : "all";

  const locale = await resolveLocale();
  const { orgId } = await getTenantContext();

  const [data, serviceOrders] = await Promise.all([
    getSchedulePageData(orgId, locale, { q, period, status, customerId }),
    // Lista de OS ativas para vincular à visita — apenas as não canceladas
    prisma.serviceOrder.findMany({
      where: {
        orgId,
        status: { not: "canceled" },
      },
      select: {
        id: true,
        title: true,
        customer: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
  ]);

  const serviceOrderOptions: ServiceOrderOption[] = serviceOrders.map((o) => ({
    id: o.id,
    title: o.title,
    customerName: o.customer?.name ?? null,
  }));

  return <SchedulePage data={data} serviceOrderOptions={serviceOrderOptions} />;
}
