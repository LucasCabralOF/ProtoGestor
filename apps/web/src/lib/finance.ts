import "server-only";

import { requireOrgId } from "@/lib/auth-tenant";
import {
  computeFinanceKpis,
  type FinanceFilters,
  type FinanceOption,
  type FinancePageData,
  formatCentsBRL,
  type TransactionRow,
} from "@/lib/finance-utils";
import prisma from "@/lib/prisma";
import type { AppLocale } from "@/utils/i18n";

const BUSINESS_TIME_ZONE = "America/Sao_Paulo";

function formatDateLabel(date: Date | null, locale: AppLocale): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", {
    timeZone: BUSINESS_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getPeriodDateRange(
  period?: string,
): { gte?: Date; lte?: Date } | undefined {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  if (period === "last_month") {
    const firstDay = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const lastDay = new Date(year, month, 0, 23, 59, 59, 999);
    return { gte: firstDay, lte: lastDay };
  }

  if (period === "this_month" || !period) {
    const firstDay = new Date(year, month, 1, 0, 0, 0, 0);
    const lastDay = new Date(year, month + 1, 0, 23, 59, 59, 999);
    return { gte: firstDay, lte: lastDay };
  }

  return undefined;
}

export async function getFinancePageData(
  filters: FinanceFilters = {},
  locale: AppLocale = "pt-BR",
): Promise<FinancePageData> {
  const { orgId } = await requireOrgId();

  const periodRange = getPeriodDateRange(filters.period);

  const whereClause: Record<string, unknown> = {
    orgId,
  };

  if (filters.type && filters.type !== "all") {
    whereClause.type = filters.type;
  }

  if (
    filters.status &&
    filters.status !== "all" &&
    filters.status !== "overdue"
  ) {
    whereClause.status = filters.status;
  }

  if (periodRange) {
    whereClause.OR = [
      { dueAt: periodRange },
      { paidAt: periodRange },
      { createdAt: periodRange },
    ];
  }

  const [transactions, accounts, categories, contacts] = await Promise.all([
    prisma.transaction.findMany({
      where: whereClause,
      include: {
        account: { select: { name: true } },
        category: { select: { name: true } },
        contact: { select: { id: true, name: true } },
      },
      orderBy: [{ dueAt: "desc" }, { createdAt: "desc" }],
      take: 200,
    }),
    prisma.financialAccount.findMany({
      where: { orgId, isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      where: { orgId },
      select: { id: true, name: true, type: true },
      orderBy: { name: "asc" },
    }),
    prisma.contact.findMany({
      where: { orgId, isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
      take: 100,
    }),
  ]);

  const now = new Date();

  const rows: TransactionRow[] = transactions.map((t) => {
    const isOverdue =
      t.status === "pending" &&
      t.dueAt !== null &&
      t.dueAt.getTime() < now.getTime();

    return {
      id: t.id,
      type: t.type,
      status: t.status,
      amountCents: t.amountCents,
      amountFormatted: formatCentsBRL(t.amountCents, locale),
      description:
        t.description || (t.type === "income" ? "Receita" : "Despesa"),
      contactId: t.contactId,
      contactName: t.contact?.name || null,
      categoryName: t.category?.name || null,
      accountName: t.account?.name || null,
      dueAt: t.dueAt ? t.dueAt.toISOString() : null,
      dueAtFormatted: formatDateLabel(t.dueAt, locale),
      paidAt: t.paidAt ? t.paidAt.toISOString() : null,
      paidAtFormatted: formatDateLabel(t.paidAt, locale),
      isOverdue,
    };
  });

  const kpis = computeFinanceKpis(rows, locale);

  const accountOptions: FinanceOption[] = accounts.map((a) => ({
    id: a.id,
    name: a.name,
  }));

  const categoryOptions = categories.map((c) => ({
    id: c.id,
    name: c.name,
    type: c.type,
  }));

  const contactOptions: FinanceOption[] = contacts.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  return {
    rows,
    kpis,
    accounts: accountOptions,
    categories: categoryOptions,
    contacts: contactOptions,
  };
}
