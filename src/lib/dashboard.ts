import "server-only";

import {
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import prisma from "@/lib/prisma";

export type DashboardData = {
  orgName: string;
  kpis: {
    monthlyRevenueCents: number;
    monthlyRevenueDeltaPct: number;
    activeClients: number;
    newClientsThisMonth: number;
    servicesThisWeek: number;
    servicesCompletedThisWeek: number;
    pendingIssues: number;
  };
  recentActivity: { id: string; message: string; createdAt: Date }[];
  upcomingServices: {
    id: string;
    title: string;
    startsAt: Date;
    customerName: string | null;
  }[];
};

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const membership = await prisma.membership.findFirst({
    where: { userId },
    select: { orgId: true, org: { select: { name: true } } },
  });

  if (!membership) {
    return {
      orgName: "Minha Empresa",
      kpis: {
        monthlyRevenueCents: 0,
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

  const orgId = membership.orgId;
  const orgName = membership.org?.name ?? "Minha Empresa";

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
    startsAt: a.startsAt,
    title: a.serviceOrder?.title ?? "Serviço",
    customerName: a.serviceOrder?.customer?.name ?? null,
  }));

  return {
    orgName,
    kpis: {
      monthlyRevenueCents: thisMonth,
      monthlyRevenueDeltaPct: deltaPct,
      activeClients,
      newClientsThisMonth,
      servicesThisWeek,
      servicesCompletedThisWeek,
      pendingIssues,
    },
    recentActivity,
    upcomingServices,
  };
}
