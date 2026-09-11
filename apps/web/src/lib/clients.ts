// src/lib/clients.ts
import "server-only";

import { requireOrgId } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";
import type { AppLocale } from "@/utils/i18n";

type StatusTone = "success" | "neutral";

export type ClientRow = {
  id: string;
  name: string;
  contactLabel: string;
  addressLabel: string;
  paymentLabel: string;
  statusLabel: string;
  statusTone: StatusTone;
  lastServiceLabel: string;
  totalServices: number;
  isActive: boolean;

  type: "person" | "company";
  legalName: string | null;
  document: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  notes: string | null;

  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
};

export type ClientsKpis = {
  newThisWeek: number;
  active: number;
  inactive: number;
  total: number;
  recurring: number;
};

export type ClientsPageData = {
  kpis: ClientsKpis;
  rows: ClientRow[];
};

export type ClientsFilters = {
  q?: string;
  status?: "all" | "active" | "inactive";
  recurring?: "all" | "yes";
};

function formatDateLabel(dt: Date | null, locale: AppLocale): string {
  if (!dt) return "—";
  return new Intl.DateTimeFormat(locale, {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dt);
}

function normalizeQ(q: string | undefined): string {
  return (q || "").trim();
}

export async function getClientsPageData(
  filters: ClientsFilters,
  locale: AppLocale = "pt-BR",
): Promise<ClientsPageData> {
  const { orgId } = await requireOrgId();

  const q = normalizeQ(filters.q);
  const status = filters.status || "all";
  const recurring = filters.recurring || "all";

  const whereStatus =
    status === "active"
      ? { isActive: true }
      : status === "inactive"
        ? { isActive: false }
        : {};

  const whereQ =
    q.length === 0
      ? {}
      : {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { legalName: { contains: q, mode: "insensitive" as const } },
            { document: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q, mode: "insensitive" as const } },
            { whatsapp: { contains: q, mode: "insensitive" as const } },
          ],
        };

  const baseWhere = {
    orgId,
    ...whereStatus,
    ...whereQ,
    roles: { some: { role: "customer" as const, orgId } },
  };

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [total, active, inactive, newThisWeek, contacts] = await Promise.all([
    prisma.contact.count({
      where: { orgId, roles: { some: { role: "customer", orgId } } },
    }),
    prisma.contact.count({
      where: {
        orgId,
        isActive: true,
        roles: { some: { role: "customer", orgId } },
      },
    }),
    prisma.contact.count({
      where: {
        orgId,
        isActive: false,
        roles: { some: { role: "customer", orgId } },
      },
    }),
    prisma.contact.count({
      where: {
        orgId,
        createdAt: { gte: weekAgo },
        roles: { some: { role: "customer", orgId } },
      },
    }),
    prisma.contact.findMany({
      where: baseWhere,
      orderBy: [{ name: "asc" }],
      include: {
        addresses: {
          where: { isPrimary: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        // ✅ totalServices e lastService sem depender de contactId scalar
        _count: { select: { serviceOrders: true } },
        serviceOrders: {
          select: { createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      take: 500,
    }),
  ]);

  const rows: ClientRow[] = contacts
    .map((c) => {
      const addr = c.addresses[0] || null;

      const totalServices = c._count.serviceOrders;
      const lastAt = c.serviceOrders[0]?.createdAt ?? null;

      const contactLabelParts: string[] = [];
      if (c.email) contactLabelParts.push(c.email);
      if (c.whatsapp) contactLabelParts.push(`WhatsApp: ${c.whatsapp}`);
      else if (c.phone) {
        contactLabelParts.push(
          locale === "en" ? `Phone: ${c.phone}` : `Tel: ${c.phone}`,
        );
      }

      const addressLabelParts: string[] = [];
      if (addr?.line1) addressLabelParts.push(addr.line1);
      if (addr?.city) addressLabelParts.push(addr.city);
      if (addr?.state) addressLabelParts.push(addr.state);

      const statusTone: StatusTone = c.isActive ? "success" : "neutral";

      return {
        id: c.id,
        name: c.name,
        contactLabel:
          contactLabelParts.length > 0 ? contactLabelParts.join(" • ") : "—",
        addressLabel:
          addressLabelParts.length > 0 ? addressLabelParts.join(" • ") : "—",
        paymentLabel: "—",
        statusLabel: c.isActive
          ? locale === "en"
            ? "Active"
            : "Ativo"
          : locale === "en"
            ? "Inactive"
            : "Inativo",
        statusTone,
        lastServiceLabel: formatDateLabel(lastAt, locale),
        totalServices,
        isActive: c.isActive,

        // Prisma enum -> literal type
        type: c.type as "person" | "company",
        legalName: c.legalName ?? null,
        document: c.document ?? null,
        email: c.email ?? null,
        phone: c.phone ?? null,
        whatsapp: c.whatsapp ?? null,
        notes: c.notes ?? null,

        addressLine1: addr?.line1 ?? null,
        addressLine2: addr?.line2 ?? null,
        city: addr?.city ?? null,
        state: addr?.state ?? null,
        postalCode: addr?.postalCode ?? null,
      };
    })
    .filter((r) => (recurring === "yes" ? r.totalServices >= 2 : true));

  // ✅ KPI recorrentes (>= 2 serviços) sem groupBy
  // Se seu volume for gigante, depois otimizamos com raw SQL (COUNT por contactId).
  const recurringBase = await prisma.contact.findMany({
    where: {
      orgId,
      isActive: true,
      roles: { some: { role: "customer", orgId } },
    },
    select: { _count: { select: { serviceOrders: true } } },
    take: 5000,
  });

  const recurringKpi = recurringBase.reduce(
    (acc, c) => acc + (c._count.serviceOrders >= 2 ? 1 : 0),
    0,
  );

  return {
    kpis: {
      newThisWeek,
      active,
      inactive,
      total,
      recurring: recurringKpi,
    },
    rows,
  };
}

export async function getClientsForExport(): Promise<ClientRow[]> {
  const data = await getClientsPageData({ status: "all", recurring: "all" });
  return data.rows;
}
