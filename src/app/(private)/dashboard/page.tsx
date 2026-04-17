import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTenantContext } from "@/lib/auth-tenant";
import { getDashboardData } from "@/lib/dashboard";
import prisma from "@/lib/prisma";
import { DashboardPage } from "@/ui/pages/privatePages/DashboardPage";
import { resolveLocale } from "@/utils/i18n";

function headersToObject(h: Headers) {
  const obj: Record<string, string> = {};
  h.forEach((v, k) => {
    obj[k] = v;
  });
  return obj;
}

export default async function DashboardRoute() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: headersToObject(h) });
  if (!session) redirect("/login");

  const locale = await resolveLocale();
  const { orgId } = await getTenantContext(session.user.id);

  // Consultas para o checklist de ativação — conta nova = sem clientes/serviços
  const [data, clientCount, serviceCount] = await Promise.all([
    getDashboardData(session.user.id, locale),
    prisma.contact.count({
      where: { orgId, isActive: true, roles: { some: { role: "customer" } } },
    }),
    prisma.serviceOrder.count({ where: { orgId } }),
  ]);

  return (
    <DashboardPage
      userName={session.user.name ?? "Admin"}
      data={data}
      hasClients={clientCount > 0}
      hasServices={serviceCount > 0}
    />
  );
}
