import "server-only";

import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { getTenantContext } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";
import {
  calculateNextRecurringDate,
  getRecurrenceRuleLabel,
  type RecurrenceRule,
  type ReturnAlertItem,
} from "@/lib/recurrence-utils";
import type { AppLocale } from "@/utils/i18n";
import type { DashboardData } from "./dashboard-utils";

export type { DashboardData } from "./dashboard-utils";

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
      returnAlerts: [],
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

  const [recentActivity, upcoming, doneRecurringApps] = await Promise.all([
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
    prisma.appointment.findMany({
      where: {
        orgId,
        status: "done",
        recurrenceRule: { not: "none" },
        serviceOrder: { customerId: { not: null } },
      },
      orderBy: { startsAt: "desc" },
      include: {
        serviceOrder: {
          select: {
            id: true,
            title: true,
            customerId: true,
            customer: {
              select: { id: true, name: true, phone: true, whatsapp: true },
            },
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

  // Deduplicação dos clientes recorrentes que precisam de agendamento de retorno
  const customerLastDoneMap = new Map<string, (typeof doneRecurringApps)[0]>();
  for (const app of doneRecurringApps) {
    const custId = app.serviceOrder?.customerId;
    if (custId && !customerLastDoneMap.has(custId)) {
      customerLastDoneMap.set(custId, app);
    }
  }

  const upcomingCustomerIds = new Set(
    (
      await prisma.appointment.findMany({
        where: {
          orgId,
          status: "scheduled",
          startsAt: { gte: now },
          serviceOrder: {
            customerId: { in: Array.from(customerLastDoneMap.keys()) },
          },
        },
        select: { serviceOrder: { select: { customerId: true } } },
      })
    )
      .map((a) => a.serviceOrder?.customerId)
      .filter((id): id is string => Boolean(id)),
  );

  const returnAlerts: ReturnAlertItem[] = [];
  for (const [custId, lastApp] of customerLastDoneMap.entries()) {
    if (upcomingCustomerIds.has(custId)) continue;
    const customer = lastApp.serviceOrder?.customer;
    if (!customer) continue;

    const dueReturnDate = calculateNextRecurringDate(
      lastApp.startsAt,
      lastApp.recurrenceRule as RecurrenceRule,
    );

    if (dueReturnDate <= monthEnd) {
      const isOverdue = dueReturnDate < now;
      returnAlerts.push({
        id: lastApp.id,
        customerId: custId,
        customerName: customer.name,
        customerPhone: customer.whatsapp || customer.phone || null,
        serviceOrderId: lastApp.serviceOrderId,
        serviceTitle: lastApp.serviceOrder?.title ?? "Serviço Recorrente",
        recurrenceRule: lastApp.recurrenceRule as
          | "weekly"
          | "biweekly"
          | "monthly",
        recurrenceRuleLabel: getRecurrenceRuleLabel(
          lastApp.recurrenceRule as RecurrenceRule,
          locale,
        ),
        lastCompletedAt: lastApp.startsAt,
        lastCompletedAtLabel: format(lastApp.startsAt, "dd/MM/yyyy"),
        dueReturnDate,
        dueReturnDateLabel: format(dueReturnDate, "dd/MM/yyyy"),
        isOverdue,
        suggestedDate: format(dueReturnDate, "yyyy-MM-dd"),
        suggestedStartTime: format(lastApp.startsAt, "HH:mm"),
        suggestedEndTime: format(lastApp.endsAt, "HH:mm"),
      });
    }
  }

  returnAlerts.sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    return a.dueReturnDate.getTime() - b.dueReturnDate.getTime();
  });

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
    returnAlerts,
    upcomingServices,
  };
}
