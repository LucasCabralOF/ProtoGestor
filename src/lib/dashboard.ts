import "server-only";

import {
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { getTenantContext } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";
import type { AppLocale } from "@/utils/i18n";

export type DashboardData = {
  orgName: string;
  kpis: {
    monthlyRevenueLabel: string;
    monthlyRevenueDeltaPct: number;
    activeClients: number;
    newClientsThisMonth: number;
    servicesThisWeek: number;
    servicesCompletedThisWeek: number;
    pendingIssues: number;
  };
  recentActivity: { createdAtLabel: string; id: string; message: string }[];
  upcomingServices: {
    id: string;
    title: string;
    startsAtLabel: string;
    customerName: string | null;
  }[];
};

function formatCurrency(cents: number, locale: AppLocale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function formatDateTime(value: Date, locale: AppLocale) {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export async function getDashboardData(
  userId: string,
  locale: AppLocale = "pt-BR",
): Promise<DashboardData> {
  let tenantContext: Awaited<ReturnType<typeof getTenantContext>>;

  try {
    tenantContext = await getTenantContext(userId);
  } catch {
    return {
      orgName: "Minha Empresa",
      kpis: {
        monthlyRevenueLabel: formatCurrency(0, locale),
        monthlyRevenueDeltaPct: 0,
        activeClients: 0,
        newClientsThisMonth: 0,
        servicesThisWeek: 0,
        servicesCompletedThisWeek: 0,
        pendingIssues: 0,
      },
      recentActivity: [],
      upcomingServices: [],
    };
  }

  const orgId = tenantContext.orgId;
  const orgName = tenantContext.org.name;

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  // Receita (somente income + paid)
  const [thisMonthIncome, lastMonthIncome] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        orgId,
        type: "income",
        status: "paid",
        paidAt: { gte: monthStart, lte: monthEnd },
      },
      _sum: { amountCents: true },
    }),
    prisma.transaction.aggregate({
      where: {
        orgId,
        type: "income",
        status: "paid",
        paidAt: { gte: lastMonthStart, lte: lastMonthEnd },
      },
      _sum: { amountCents: true },
    }),
  ]);

  const thisMonth = thisMonthIncome._sum.amountCents ?? 0;
  const lastMonth = lastMonthIncome._sum.amountCents ?? 0;
  const deltaPct =
    lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0;

  // Clientes = Contact com role customer
  const [activeClients, newClientsThisMonth] = await Promise.all([
    prisma.contact.count({
      where: {
        orgId,
        isActive: true,
        roles: { some: { role: "customer" } },
      },
    }),
    prisma.contact.count({
      where: {
        orgId,
        createdAt: { gte: monthStart },
        roles: { some: { role: "customer" } },
      },
    }),
  ]);

  // Semana (agenda)
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const [servicesThisWeek, servicesCompletedThisWeek] = await Promise.all([
    prisma.appointment.count({
      where: { orgId, startsAt: { gte: weekStart, lte: weekEnd } },
    }),
    prisma.appointment.count({
      where: {
        orgId,
        status: "done",
        startsAt: { gte: weekStart, lte: weekEnd },
      },
    }),
  ]);

  const pendingIssues = Math.max(
    0,
    servicesThisWeek - servicesCompletedThisWeek,
  );

  const [recentActivity, upcoming] = await Promise.all([
    prisma.activityLog.findMany({
      where: { orgId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, message: true, createdAt: true },
    }),
    prisma.appointment.findMany({
      where: { orgId, status: "scheduled", startsAt: { gte: now } },
      orderBy: { startsAt: "asc" },
      take: 5,
      select: {
        id: true,
        startsAt: true,
        serviceOrder: {
          select: {
            title: true,
            customer: { select: { name: true } },
          },
        },
      },
    }),
  ]);

  const upcomingServices = upcoming.map((a) => ({
    id: a.id,
    startsAtLabel: formatDateTime(a.startsAt, locale),
    title: a.serviceOrder?.title ?? (locale === "en" ? "Service" : "Serviço"),
    customerName: a.serviceOrder?.customer?.name ?? null,
  }));

  return {
    orgName,
    kpis: {
      monthlyRevenueLabel: formatCurrency(thisMonth, locale),
      monthlyRevenueDeltaPct: deltaPct,
      activeClients,
      newClientsThisMonth,
      servicesThisWeek,
      servicesCompletedThisWeek,
      pendingIssues,
    },
    recentActivity: recentActivity.map((item) => ({
      id: item.id,
      message: item.message,
      createdAtLabel: formatDateTime(item.createdAt, locale),
    })),
    upcomingServices,
  };
}
