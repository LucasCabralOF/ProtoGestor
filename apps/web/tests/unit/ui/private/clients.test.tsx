// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ClientRow, ClientsKpis as ClientsKpisType } from "@/lib/clients";
import { ClientsFilters } from "@/ui/pages/privatePages/clients-components/ClientsFilters";
import { ClientsHeader } from "@/ui/pages/privatePages/clients-components/ClientsHeader";
import { ClientsKpis } from "@/ui/pages/privatePages/clients-components/ClientsKpis";
import { ClientsTable } from "@/ui/pages/privatePages/clients-components/ClientsTable";

afterEach(() => {
  cleanup();
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    if (params?.id) return `ID: ${params.id}`;
    if (params?.value !== undefined) return `${key}:${params.value}`;
    return key;
  },
}));

describe("ClientsHeader", () => {
  it("renderiza título e dispara callback de novo cliente", () => {
    const onNew = vi.fn();
    const onImport = vi.fn();

    render(
      <ClientsHeader
        exportHref="/clients/export"
        importing={false}
        onImport={onImport}
        onNew={onNew}
      />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
    const addButton = screen.getByTestId("button-clients-add");
    fireEvent.click(addButton);
    expect(onNew).toHaveBeenCalledTimes(1);
  });
});

describe("ClientsKpis", () => {
  it("renderiza os contadores de KPIs de clientes", () => {
    const kpis: ClientsKpisType = {
      newThisWeek: 4,
      active: 12,
      inactive: 2,
      total: 14,
      recurring: 8,
    };

    render(<ClientsKpis kpis={kpis} />);

    expect(screen.getByText("4")).toBeDefined();
    expect(screen.getByText("12")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByText("14")).toBeDefined();
    expect(screen.getByText("8")).toBeDefined();
  });
});

describe("ClientsFilters", () => {
  it("dispara onParamChange ao pesquisar ou mudar status", () => {
    const onParamChange = vi.fn();

    render(
      <ClientsFilters
        q=""
        status="all"
        recurring="all"
        onParamChange={onParamChange}
      />,
    );

    const searchInput = screen.getByTestId("input-clients-search");
    fireEvent.change(searchInput, { target: { value: "Empresa XPTO" } });
    expect(onParamChange).toHaveBeenCalledWith("q", "Empresa XPTO");

    const selectStatus = screen.getByTestId("select-clients-status");
    fireEvent.change(selectStatus, { target: { value: "active" } });
    expect(onParamChange).toHaveBeenCalledWith("status", "active");
  });
});

describe("ClientsTable", () => {
  it("renderiza lista de clientes e tabela", () => {
    const onEdit = vi.fn();
    const onToggleActive = vi.fn();
    const mockRow: ClientRow = {
      id: "cli-12345678",
      name: "Empresa Modelo",
      contactLabel: "contato@modelo.com",
      addressLabel: "Rua das Flores, 123",
      paymentLabel: "Mensal",
      statusLabel: "Ativo",
      statusTone: "success",
      lastServiceLabel: "10/05/2026",
      totalServices: 5,
      isActive: true,
      type: "company",
      legalName: "Modelo LTDA",
      document: "12.345.678/0001-90",
      email: "contato@modelo.com",
      phone: "11999999999",
      whatsapp: "11999999999",
      notes: null,
      addressLine1: "Rua das Flores, 123",
      addressLine2: null,
      city: "São Paulo",
      state: "SP",
      postalCode: "01000-000",
    };

    render(
      <ClientsTable
        rows={[mockRow]}
        onEdit={onEdit}
        onToggleActive={onToggleActive}
      />,
    );

    expect(screen.getByTestId("table-clients-list")).toBeDefined();
    expect(screen.getByText("Empresa Modelo")).toBeDefined();
    expect(screen.getByText("contato@modelo.com")).toBeDefined();
  });
});
