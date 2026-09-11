// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { FinanceKpisData, TransactionRow } from "@/lib/finance-utils";
import { FinanceFilters } from "@/ui/pages/privatePages/finance-components/FinanceFilters";
import { FinanceHeader } from "@/ui/pages/privatePages/finance-components/FinanceHeader";
import { FinanceKpis } from "@/ui/pages/privatePages/finance-components/FinanceKpis";
import { FinanceTable } from "@/ui/pages/privatePages/finance-components/FinanceTable";

afterEach(() => {
  cleanup();
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
  usePathname: () => "/finance",
  useSearchParams: () => new URLSearchParams(),
}));

describe("FinanceHeader", () => {
  it("renderiza título do módulo financeiro e dispara onNewTransaction", () => {
    const onNewTransaction = vi.fn();
    render(<FinanceHeader onNewTransaction={onNewTransaction} />);

    expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
    expect(screen.getByText("Financeiro")).toBeDefined();

    const button = screen.getByTestId("button-finance-new-transaction");
    fireEvent.click(button);
    expect(onNewTransaction).toHaveBeenCalledTimes(1);
  });
});

describe("FinanceKpis", () => {
  it("renderiza os 5 indicadores financeiros", () => {
    const kpis: FinanceKpisData = {
      totalIncomePaid: 150000,
      totalIncomePaidFormatted: "R$ 1.500,00",
      totalIncomePending: 80000,
      totalIncomePendingFormatted: "R$ 800,00",
      totalIncomeOverdue: 20000,
      totalIncomeOverdueFormatted: "R$ 200,00",
      totalExpensePaid: 30000,
      totalExpensePaidFormatted: "R$ 300,00",
      netBalance: 120000,
      netBalanceFormatted: "R$ 1.200,00",
    };

    render(<FinanceKpis kpis={kpis} />);

    expect(screen.getByText("R$ 1.500,00")).toBeDefined();
    expect(screen.getByText("R$ 800,00")).toBeDefined();
    expect(screen.getByText("R$ 200,00")).toBeDefined();
    expect(screen.getByText("R$ 300,00")).toBeDefined();
    expect(screen.getByText("R$ 1.200,00")).toBeDefined();
  });
});

describe("FinanceFilters", () => {
  it("renderiza campos de busca, período, tipo e status", () => {
    render(
      <FinanceFilters
        currentFilters={{
          period: "this_month",
          type: "all",
          status: "all",
          q: "",
        }}
      />,
    );

    expect(screen.getByTestId("finance-search-input")).toBeDefined();
    expect(screen.getByTestId("finance-filter-period")).toBeDefined();
    expect(screen.getByTestId("finance-filter-type")).toBeDefined();
    expect(screen.getByTestId("finance-filter-status")).toBeDefined();
  });
});

describe("FinanceTable", () => {
  it("renderiza lista de transações e botão de dar baixa", () => {
    const onMarkPaid = vi.fn();
    const onCancel = vi.fn();

    const mockRows: TransactionRow[] = [
      {
        id: "tx-1",
        type: "income",
        status: "pending",
        amountCents: 25000,
        amountFormatted: "R$ 250,00",
        description: "Manutenção Preventiva #12",
        dueAt: "2026-09-10T12:00:00Z",
        dueAtFormatted: "10/09/2026",
        isOverdue: false,
        paidAt: null,
        paidAtFormatted: null,
        contactId: "c-1",
        contactName: "Empresa XPTO",
        categoryName: "Serviços",
        accountName: "Conta Principal",
      },
    ];

    render(
      <FinanceTable
        rows={mockRows}
        onMarkPaid={onMarkPaid}
        onCancel={onCancel}
        loadingId={null}
      />,
    );

    expect(screen.getByTestId("finance-row-tx-1")).toBeDefined();
    expect(screen.getByText("Manutenção Preventiva #12")).toBeDefined();
    expect(screen.getByText("+ R$ 250,00")).toBeDefined();

    const markPaidBtn = screen.getByTestId("button-mark-paid-tx-1");
    fireEvent.click(markPaidBtn);
    expect(onMarkPaid).toHaveBeenCalledWith("tx-1");
  });

  it("renderiza estado vazio quando não há registros", () => {
    render(
      <FinanceTable
        rows={[]}
        onMarkPaid={vi.fn()}
        onCancel={vi.fn()}
        loadingId={null}
      />,
    );

    expect(screen.getByText("Nenhuma movimentação encontrada")).toBeDefined();
  });
});
