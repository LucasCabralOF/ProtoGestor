import "server-only";

import {
  addDays,
  eachMonthOfInterval,
  endOfDay,
  startOfDay,
  startOfMonth,
  subDays,
} from "date-fns";
import { getTenantContext } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";
import type { AppLocale } from "@/utils/i18n";
import type {
  ReportsAttentionItem,
  ReportsCategoryRow,
  ReportsData,
  ReportsExportRow,
  ReportsFilters,
  ReportsServiceStatusRow,
} from "./reports-types";
import {
  buildTrend,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatInteger,
  formatMonth,
  formatPercent,
  normalizeFocus,
  normalizeRange,
  rangeDays,
  serviceStatusMeta,
} from "./reports-utils";

export * from "./reports-types";

export async function getReportsData(
  filters: ReportsFilters,
  locale: AppLocale = "pt-BR",
): Promise<ReportsData> {
  const { orgId, org } = await getTenantContext();

  const range = normalizeRange(filters.range);
  const focus = normalizeFocus(filters.focus);
  const days = rangeDays(range);

  const now = new Date();
  const periodEnd = endOfDay(now);
  const periodStart = startOfDay(subDays(periodEnd, days - 1));
  const previousEnd = new Date(periodStart.getTime() - 1);
  const previousStart = startOfDay(subDays(previousEnd, days - 1));
  const upcomingCutoff = addDays(now, 30);

  const customerRoleFilter = {
    roles: {
      some: {
        orgId,
        role: "customer" as const,
      },
    },
  };

  const [
    currentPaidTransactions,
    previousPaidTransactions,
    activeCustomers,
    newCustomers,
    serviceOrders,
    serviceStatusCounts,
    periodAppointments,
    upcomingAppointments,
    overdueTransactions,
  ] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        orgId,
        status: "paid",
        paidAt: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
      select: {
        id: true,
        amountCents: true,
        paidAt: true,
        type: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.transaction.findMany({
      where: {
        orgId,
        status: "paid",
        paidAt: {
          gte: previousStart,
          lte: previousEnd,
        },
      },
      select: {
        amountCents: true,
        type: true,
      },
    }),
    prisma.contact.count({
      where: {
        orgId,
        isActive: true,
        ...customerRoleFilter,
      },
    }),
    prisma.contact.count({
      where: {
        orgId,
        createdAt: {
          gte: periodStart,
          lte: periodEnd,
        },
        ...customerRoleFilter,
      },
    }),
    prisma.serviceOrder.findMany({
      where: {
        orgId,
        createdAt: {
          gte: periodStart,
          lte: periodEnd,
        },
        status: {
          not: "canceled",
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 300,
    }),
    prisma.serviceOrder.groupBy({
      by: ["status"],
      where: {
        orgId,
      },
      _count: {
        _all: true,
      },
    }),
    prisma.appointment.findMany({
      where: {
        orgId,
        startsAt: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
      select: {
        id: true,
        status: true,
      },
    }),
    prisma.appointment.findMany({
      where: {
        orgId,
        startsAt: {
          gte: now,
          lte: upcomingCutoff,
        },
        status: "scheduled",
      },
      orderBy: {
        startsAt: "asc",
      },
      take: 6,
      select: {
        id: true,
        startsAt: true,
        locationText: true,
        serviceOrder: {
          select: {
            title: true,
            customer: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.transaction.findMany({
      where: {
        orgId,
        status: "pending",
        dueAt: {
          lt: now,
        },
      },
      orderBy: {
        dueAt: "asc",
      },
      take: 6,
      select: {
        id: true,
        type: true,
        amountCents: true,
        description: true,
        dueAt: true,
        contact: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  const currentIncome = currentPaidTransactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amountCents, 0);
  const currentExpenses = currentPaidTransactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amountCents, 0);
  const previousIncome = previousPaidTransactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amountCents, 0);
  const previousExpenses = previousPaidTransactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amountCents, 0);

  const currentNet = currentIncome - currentExpenses;
  const previousNet = previousIncome - previousExpenses;
  const paidIncomeCount = currentPaidTransactions.filter(
    (item) => item.type === "income",
  ).length;
  const avgTicket =
    paidIncomeCount === 0 ? 0 : Math.round(currentIncome / paidIncomeCount);

  const completedAppointments = periodAppointments.filter(
    (item) => item.status === "done",
  ).length;
  const completionRate =
    periodAppointments.length === 0
      ? 0
      : Math.round((completedAppointments / periodAppointments.length) * 100);

  const currentCustomersBase = await prisma.contact.count({
    where: {
      orgId,
      createdAt: {
        gte: previousStart,
        lte: previousEnd,
      },
      ...customerRoleFilter,
    },
  });

  const monthlyStart = startOfMonth(periodStart);
  const monthlyEnd = startOfMonth(periodEnd);
  const monthKeys = eachMonthOfInterval({
    start: monthlyStart,
    end: monthlyEnd,
  });

  const monthlyMap = new Map<
    string,
    {
      expense: number;
      income: number;
    }
  >();

  for (const monthDate of monthKeys) {
    monthlyMap.set(monthDate.toISOString().slice(0, 7), {
      income: 0,
      expense: 0,
    });
  }

  for (const item of currentPaidTransactions) {
    if (!item.paidAt) continue;
    const key = item.paidAt.toISOString().slice(0, 7);
    const bucket = monthlyMap.get(key);
    if (!bucket) continue;

    if (item.type === "income") bucket.income += item.amountCents;
    else bucket.expense += item.amountCents;
  }

  const maxMonthlyValue = Math.max(
    1,
    ...Array.from(monthlyMap.values()).flatMap((item) => [
      item.income,
      item.expense,
    ]),
  );

  const monthlySeries = monthKeys.map((monthDate) => {
    const key = monthDate.toISOString().slice(0, 7);
    const bucket = monthlyMap.get(key) ?? { income: 0, expense: 0 };
    return {
      label: formatMonth(monthDate, locale),
      incomeCents: bucket.income,
      incomeLabel: formatCurrency(bucket.income, locale),
      expenseCents: bucket.expense,
      expenseLabel: formatCurrency(bucket.expense, locale),
      balanceCents: bucket.income - bucket.expense,
      balanceLabel: formatCurrency(bucket.income - bucket.expense, locale),
      incomeWidthPct: Math.max(
        bucket.income === 0 ? 6 : 10,
        Math.round((bucket.income / maxMonthlyValue) * 100),
      ),
      expenseWidthPct: Math.max(
        bucket.expense === 0 ? 6 : 10,
        Math.round((bucket.expense / maxMonthlyValue) * 100),
      ),
    };
  });

  const categoryGroups = currentPaidTransactions.reduce<
    Record<
      "expense" | "income",
      Map<
        string,
        {
          amount: number;
          count: number;
        }
      >
    >
  >(
    (acc, item) => {
      const key =
        item.category?.name ??
        (locale === "en" ? "Uncategorized" : "Sem categoria");
      const target = acc[item.type];
      const current = target.get(key) ?? { amount: 0, count: 0 };
      current.amount += item.amountCents;
      current.count += 1;
      target.set(key, current);
      return acc;
    },
    {
      income: new Map(),
      expense: new Map(),
    },
  );

  function mapCategoryRows(type: "expense" | "income"): ReportsCategoryRow[] {
    const total = type === "income" ? currentIncome : currentExpenses;
    return Array.from(categoryGroups[type].entries())
      .map(([name, entry]) => {
        const sharePct =
          total === 0 ? 0 : Math.round((entry.amount / total) * 100);

        return {
          amount: entry.amount,
          amountCents: entry.amount,
          name,
          count: entry.count,
          amountLabel: formatCurrency(entry.amount, locale),
          sharePct,
          shareLabel: formatPercent(sharePct, locale),
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .map(({ amount: _amount, ...row }) => row)
      .slice(0, 5);
  }

  const customerMap = new Map<
    string,
    {
      lastServiceAt: Date;
      name: string;
      revenue: number;
      servicesCount: number;
    }
  >();

  for (const order of serviceOrders) {
    if (!order.customer?.id) continue;

    const current = customerMap.get(order.customer.id) ?? {
      name: order.customer.name,
      revenue: 0,
      servicesCount: 0,
      lastServiceAt: order.createdAt,
    };

    current.revenue += order.valueCents;
    current.servicesCount += 1;
    if (order.createdAt > current.lastServiceAt) {
      current.lastServiceAt = order.createdAt;
    }

    customerMap.set(order.customer.id, current);
  }

  const topCustomers = Array.from(customerMap.entries())
    .map(([id, item]) => ({
      id,
      name: item.name,
      revenueCents: item.revenue,
      revenueLabel: formatCurrency(item.revenue, locale),
      servicesCount: item.servicesCount,
      lastServiceLabel: formatDate(item.lastServiceAt, locale),
    }))
    .sort((a, b) => b.servicesCount - a.servicesCount)
    .slice(0, 6);

  const serviceStatusOrder: ReportsServiceStatusRow["key"][] = [
    "draft",
    "scheduled",
    "in_progress",
    "completed",
    "canceled",
  ];

  const serviceStatus = serviceStatusOrder.map((statusKey) => {
    const match = serviceStatusCounts.find((item) => item.status === statusKey);
    const meta = serviceStatusMeta(statusKey, locale);
    return {
      key: statusKey,
      label: meta.label,
      tone: meta.tone,
      count: match?._count._all ?? 0,
    };
  });

  const upcomingRows = upcomingAppointments.map((item) => ({
    id: item.id,
    title:
      item.serviceOrder?.title ??
      (locale === "en" ? "Scheduled service" : "Serviço agendado"),
    customerName: item.serviceOrder?.customer?.name ?? null,
    startsAtLabel: formatDateTime(item.startsAt, locale),
    locationText: item.locationText ?? null,
  }));

  const overdueRows = overdueTransactions.map((item) => ({
    id: item.id,
    description:
      item.description ??
      (item.type === "income"
        ? locale === "en"
          ? "Pending receivable"
          : "Recebimento pendente"
        : locale === "en"
          ? "Pending payable"
          : "Pagamento pendente"),
    contactName: item.contact?.name ?? null,
    amountLabel: formatCurrency(item.amountCents, locale),
    dueAtLabel: item.dueAt ? formatDate(item.dueAt, locale) : "—",
    typeLabel:
      item.type === "income"
        ? locale === "en"
          ? "Receivable"
          : "Receber"
        : locale === "en"
          ? "Payable"
          : "Pagar",
  }));

  const attentionItems: ReportsAttentionItem[] = [];

  if (currentNet < 0) {
    attentionItems.push({
      id: "negative-net",
      tone: "danger",
      title:
        locale === "en" ? "Negative net result" : "Resultado líquido negativo",
      description:
        locale === "en"
          ? "Expenses exceeded paid revenue in the selected period."
          : "As despesas superaram a receita recebida no período selecionado.",
    });
  }

  if (overdueRows.length > 0) {
    attentionItems.push({
      id: "overdue-finance",
      tone: "warning",
      title:
        locale === "en"
          ? "Open overdue financial items"
          : "Pendências financeiras vencidas",
      description:
        locale === "en"
          ? `${formatInteger(overdueRows.length, locale)} overdue transactions need follow-up.`
          : `${formatInteger(overdueRows.length, locale)} lançamentos vencidos pedem acompanhamento.`,
    });
  }

  if (completionRate < 60 && periodAppointments.length > 0) {
    attentionItems.push({
      id: "service-completion",
      tone: "accent",
      title:
        locale === "en" ? "Execution below target" : "Execução abaixo da meta",
      description:
        locale === "en"
          ? "Appointment completion is below 60% in the selected window."
          : "A conclusão de atendimentos ficou abaixo de 60% na janela selecionada.",
    });
  }

  if (newCustomers === 0) {
    attentionItems.push({
      id: "new-customers",
      tone: "success",
      title:
        locale === "en"
          ? "No new customers in the period"
          : "Sem novos clientes no período",
      description:
        locale === "en"
          ? "Use the current window to review acquisition channels and reactivation efforts."
          : "Use a janela atual para revisar aquisição e reativação de clientes.",
    });
  }

  return {
    orgName: org.name,
    generatedAtLabel: formatDateTime(now, locale),
    periodLabel:
      locale === "en"
        ? `${formatDate(periodStart, locale)} to ${formatDate(periodEnd, locale)}`
        : `${formatDate(periodStart, locale)} a ${formatDate(periodEnd, locale)}`,
    filters: {
      range,
      focus,
    },
    kpis: {
      receivedRevenueLabel: formatCurrency(currentIncome, locale),
      paidExpensesLabel: formatCurrency(currentExpenses, locale),
      netResultLabel: formatCurrency(currentNet, locale),
      avgTicketLabel: formatCurrency(avgTicket, locale),
      newCustomers,
      activeCustomers,
      completionRateLabel: formatPercent(completionRate, locale),
      scheduledLoadLabel: `${formatInteger(upcomingRows.length, locale)} / ${formatInteger(
        periodAppointments.length,
        locale,
      )}`,
    },
    trends: {
      revenue: buildTrend(currentIncome, previousIncome, (value) =>
        formatCurrency(value, locale),
      ),
      expenses: buildTrend(currentExpenses, previousExpenses, (value) =>
        formatCurrency(value, locale),
      ),
      net: buildTrend(currentNet, previousNet, (value) =>
        formatCurrency(value, locale),
      ),
      customers: buildTrend(newCustomers, currentCustomersBase, (value) =>
        formatInteger(value, locale),
      ),
    },
    monthlySeries,
    categories: {
      income: mapCategoryRows("income"),
      expense: mapCategoryRows("expense"),
    },
    topCustomers,
    serviceStatus,
    upcomingAppointments: upcomingRows,
    overdueTransactions: overdueRows,
    attentionItems,
  };
}

export async function getReportsExportRows(
  filters: ReportsFilters,
  locale: AppLocale = "pt-BR",
): Promise<ReportsExportRow[]> {
  const data = await getReportsData(filters, locale);

  const rows: ReportsExportRow[] = [
    { section: "summary", metric: "organization", value: data.orgName },
    { section: "summary", metric: "period", value: data.periodLabel },
    { section: "summary", metric: "generatedAt", value: data.generatedAtLabel },
    {
      section: "summary",
      metric: "receivedRevenue",
      value: data.kpis.receivedRevenueLabel,
    },
    {
      section: "summary",
      metric: "paidExpenses",
      value: data.kpis.paidExpensesLabel,
    },
    {
      section: "summary",
      metric: "netResult",
      value: data.kpis.netResultLabel,
    },
    {
      section: "summary",
      metric: "avgTicket",
      value: data.kpis.avgTicketLabel,
    },
    {
      section: "summary",
      metric: "newCustomers",
      value: String(data.kpis.newCustomers),
    },
    {
      section: "summary",
      metric: "activeCustomers",
      value: String(data.kpis.activeCustomers),
    },
    {
      section: "summary",
      metric: "completionRate",
      value: data.kpis.completionRateLabel,
    },
  ];

  rows.push(
    ...data.monthlySeries.flatMap((item) => [
      {
        section: "monthlySeries",
        metric: `${item.label} income`,
        value: item.incomeLabel,
      },
      {
        section: "monthlySeries",
        metric: `${item.label} expense`,
        value: item.expenseLabel,
      },
      {
        section: "monthlySeries",
        metric: `${item.label} balance`,
        value: item.balanceLabel,
      },
    ]),
  );

  rows.push(
    ...data.topCustomers.map((item) => ({
      section: "topCustomers",
      metric: `${item.name} (${item.servicesCount})`,
      value: item.revenueLabel,
    })),
  );

  rows.push(
    ...data.categories.income.map((item) => ({
      section: "incomeCategories",
      metric: `${item.name} (${item.shareLabel})`,
      value: item.amountLabel,
    })),
  );

  rows.push(
    ...data.categories.expense.map((item) => ({
      section: "expenseCategories",
      metric: `${item.name} (${item.shareLabel})`,
      value: item.amountLabel,
    })),
  );

  rows.push(
    ...data.upcomingAppointments.map((item) => ({
      section: "upcomingAppointments",
      metric: item.title,
      value: `${item.startsAtLabel}${item.customerName ? ` • ${item.customerName}` : ""}`,
    })),
  );

  rows.push(
    ...data.overdueTransactions.map((item) => ({
      section: "overdueTransactions",
      metric: item.description,
      value: `${item.amountLabel} • ${item.dueAtLabel}`,
    })),
  );

  return rows;
}
