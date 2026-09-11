import { describe, expect, it } from "vitest";
import {
  computeFinanceKpis,
  filterTransactions,
  formatCentsBRL,
  parseCurrencyInputToCents,
  type TransactionRow,
} from "@/lib/finance-utils";

describe("finance-utils", () => {
  it("formats cents to BRL currency string correctly", () => {
    const formatted = formatCentsBRL(125050, "pt-BR");
    expect(formatted).toContain("1.250,50");
  });

  it("parses user currency input to cents", () => {
    expect(parseCurrencyInputToCents("1250,50")).toBe(125050);
    expect(parseCurrencyInputToCents("R$ 1.250,50")).toBe(125050);
    expect(parseCurrencyInputToCents("50")).toBe(5000);
    expect(parseCurrencyInputToCents("")).toBe(0);
    expect(parseCurrencyInputToCents(null)).toBe(0);
  });

  it("throws error on negative or invalid currency input", () => {
    expect(() => parseCurrencyInputToCents("-50")).toThrow(
      "INVALID_CURRENCY_VALUE",
    );
    expect(() => parseCurrencyInputToCents("abc")).toThrow(
      "INVALID_CURRENCY_VALUE",
    );
  });

  it("computes finance KPIs accurately", () => {
    const mockRows: TransactionRow[] = [
      {
        id: "tx-1",
        type: "income",
        status: "paid",
        amountCents: 100000,
        amountFormatted: "R$ 1.000,00",
        description: "Serviço A",
        dueAt: null,
        dueAtFormatted: "Hoje",
        isOverdue: false,
        paidAt: null,
        paidAtFormatted: "Hoje",
        contactId: null,
        contactName: "Cliente 1",
        categoryName: "Serviços",
        accountName: "Conta Principal",
      },
      {
        id: "tx-2",
        type: "income",
        status: "pending",
        amountCents: 50000,
        amountFormatted: "R$ 500,00",
        description: "Serviço B",
        dueAt: null,
        dueAtFormatted: "Ontem",
        isOverdue: true,
        paidAt: null,
        paidAtFormatted: null,
        contactId: null,
        contactName: "Cliente 2",
        categoryName: "Serviços",
        accountName: "Conta Principal",
      },
      {
        id: "tx-3",
        type: "income",
        status: "pending",
        amountCents: 30000,
        amountFormatted: "R$ 300,00",
        description: "Serviço C",
        dueAt: null,
        dueAtFormatted: "Amanhã",
        isOverdue: false,
        paidAt: null,
        paidAtFormatted: null,
        contactId: null,
        contactName: "Cliente 3",
        categoryName: "Serviços",
        accountName: "Conta Principal",
      },
      {
        id: "tx-4",
        type: "expense",
        status: "paid",
        amountCents: 20000,
        amountFormatted: "R$ 200,00",
        description: "Combustível",
        dueAt: null,
        dueAtFormatted: "Hoje",
        isOverdue: false,
        paidAt: null,
        paidAtFormatted: "Hoje",
        contactId: null,
        contactName: "Posto",
        categoryName: "Operacional",
        accountName: "Conta Principal",
      },
    ];

    const kpis = computeFinanceKpis(mockRows, "pt-BR");

    expect(kpis.totalIncomePaid).toBe(100000);
    expect(kpis.totalIncomePending).toBe(80000);
    expect(kpis.totalIncomeOverdue).toBe(50000);
    expect(kpis.totalExpensePaid).toBe(20000);
    expect(kpis.netBalance).toBe(80000);
  });

  it("filters transactions by type, status and search query", () => {
    const mockRows: TransactionRow[] = [
      {
        id: "tx-1",
        type: "income",
        status: "paid",
        amountCents: 1000,
        amountFormatted: "R$ 10,00",
        description: "Instalação Ar",
        dueAt: null,
        dueAtFormatted: "",
        isOverdue: false,
        paidAt: null,
        paidAtFormatted: "",
        contactId: null,
        contactName: "Carlos",
        categoryName: "Serviço",
        accountName: "Nubank",
      },
      {
        id: "tx-2",
        type: "expense",
        status: "pending",
        amountCents: 500,
        amountFormatted: "R$ 5,00",
        description: "Gás Refrigerante",
        dueAt: null,
        dueAtFormatted: "",
        isOverdue: true,
        paidAt: null,
        paidAtFormatted: "",
        contactId: null,
        contactName: "Fornecedor",
        categoryName: "Peças",
        accountName: "Nubank",
      },
    ];

    expect(filterTransactions(mockRows, { type: "expense" })).toHaveLength(1);
    expect(filterTransactions(mockRows, { type: "income" })).toHaveLength(1);
    expect(filterTransactions(mockRows, { status: "overdue" })).toHaveLength(1);
    expect(filterTransactions(mockRows, { status: "paid" })).toHaveLength(1);
    expect(filterTransactions(mockRows, { q: "Instalação" })).toHaveLength(1);
    expect(filterTransactions(mockRows, { q: "Fornecedor" })).toHaveLength(1);
    expect(filterTransactions(mockRows, { q: "inexistente" })).toHaveLength(0);
  });
});
