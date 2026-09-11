import type { AppLocale } from "@/utils/i18n";

export type TransactionType = "income" | "expense";
export type TransactionStatus = "pending" | "paid" | "canceled";

export type TransactionRow = {
  accountName: string | null;
  amountCents: number;
  amountFormatted: string;
  categoryName: string | null;
  contactId: string | null;
  contactName: string | null;
  description: string;
  dueAt: string | null;
  dueAtFormatted: string;
  id: string;
  isOverdue: boolean;
  paidAt: string | null;
  paidAtFormatted: string | null;
  status: TransactionStatus;
  type: TransactionType;
};

export type FinanceKpisData = {
  netBalance: number;
  netBalanceFormatted: string;
  totalExpensePaid: number;
  totalExpensePaidFormatted: string;
  totalIncomeOverdue: number;
  totalIncomeOverdueFormatted: string;
  totalIncomePaid: number;
  totalIncomePaidFormatted: string;
  totalIncomePending: number;
  totalIncomePendingFormatted: string;
};

export type FinanceFilters = {
  period?: "this_month" | "last_month" | "all";
  q?: string;
  status?: "all" | TransactionStatus | "overdue";
  type?: "all" | TransactionType;
};

export type FinanceOption = {
  id: string;
  name: string;
};

export type FinancePageData = {
  accounts: FinanceOption[];
  categories: (FinanceOption & { type: TransactionType })[];
  contacts: FinanceOption[];
  kpis: FinanceKpisData;
  rows: TransactionRow[];
};

export function formatCentsBRL(
  cents: number,
  locale: AppLocale = "pt-BR",
): string {
  const amount = cents / 100;
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "pt-BR", {
    style: "currency",
    currency: locale === "en" ? "USD" : "BRL",
  }).format(amount);
}

export function parseCurrencyInputToCents(
  value: string | null | undefined,
): number {
  if (!value) return 0;
  const normalized = value
    .replaceAll("R$", "")
    .replaceAll("$", "")
    .replaceAll(/\s+/g, "")
    .replaceAll(".", "")
    .replace(",", ".");

  const num = Number(normalized);
  if (!Number.isFinite(num) || num < 0) {
    throw new Error("INVALID_CURRENCY_VALUE");
  }
  return Math.round(num * 100);
}

export function computeFinanceKpis(
  rows: TransactionRow[],
  locale: AppLocale = "pt-BR",
): FinanceKpisData {
  let totalIncomePaid = 0;
  let totalIncomePending = 0;
  let totalIncomeOverdue = 0;
  let totalExpensePaid = 0;

  for (const row of rows) {
    if (row.type === "income") {
      if (row.status === "paid") {
        totalIncomePaid += row.amountCents;
      } else if (row.status === "pending") {
        totalIncomePending += row.amountCents;
        if (row.isOverdue) {
          totalIncomeOverdue += row.amountCents;
        }
      }
    } else if (row.type === "expense") {
      if (row.status === "paid") {
        totalExpensePaid += row.amountCents;
      }
    }
  }

  const netBalance = totalIncomePaid - totalExpensePaid;

  return {
    totalIncomePaid,
    totalIncomePaidFormatted: formatCentsBRL(totalIncomePaid, locale),
    totalIncomePending,
    totalIncomePendingFormatted: formatCentsBRL(totalIncomePending, locale),
    totalIncomeOverdue,
    totalIncomeOverdueFormatted: formatCentsBRL(totalIncomeOverdue, locale),
    totalExpensePaid,
    totalExpensePaidFormatted: formatCentsBRL(totalExpensePaid, locale),
    netBalance,
    netBalanceFormatted: formatCentsBRL(netBalance, locale),
  };
}

export function filterTransactions(
  rows: TransactionRow[],
  filters: FinanceFilters,
): TransactionRow[] {
  const q = (filters.q || "").toLowerCase().trim();
  const type = filters.type || "all";
  const status = filters.status || "all";

  return rows.filter((row) => {
    if (type !== "all" && row.type !== type) {
      return false;
    }

    if (status === "overdue") {
      if (!row.isOverdue || row.status !== "pending") return false;
    } else if (status !== "all" && row.status !== status) {
      return false;
    }

    if (q) {
      const matchDesc = row.description.toLowerCase().includes(q);
      const matchContact = (row.contactName || "").toLowerCase().includes(q);
      const matchCat = (row.categoryName || "").toLowerCase().includes(q);
      const matchAcc = (row.accountName || "").toLowerCase().includes(q);
      if (!matchDesc && !matchContact && !matchCat && !matchAcc) {
        return false;
      }
    }

    return true;
  });
}
