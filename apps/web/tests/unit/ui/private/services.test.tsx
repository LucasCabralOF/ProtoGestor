// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type {
  ServiceRow,
  ServicesKpis as ServicesKpisType,
} from "@/lib/services";
import { ServicesFilters } from "@/ui/pages/privatePages/services-components/ServicesFilters";
import { ServicesHeader } from "@/ui/pages/privatePages/services-components/ServicesHeader";
import { ServicesKpis } from "@/ui/pages/privatePages/services-components/ServicesKpis";
import { ServicesTable } from "@/ui/pages/privatePages/services-components/ServicesTable";

afterEach(() => {
  cleanup();
});

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    if (params?.id) return `ID: ${params.id}`;
    if (params?.value !== undefined) return `${key}:${params.value}`;
    return key;
  },
}));

describe("ServicesHeader", () => {
  it("renderiza título e dispara onNew", () => {
    const onNew = vi.fn();
    render(<ServicesHeader onNew={onNew} />);

    expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
    const addButton = screen.getByTestId("button-services-add");
    fireEvent.click(addButton);
    expect(onNew).toHaveBeenCalledTimes(1);
  });
});

describe("ServicesKpis", () => {
  it("renderiza os 5 indicadores de serviços", () => {
    const kpis: ServicesKpisType = {
      total: 20,
      scheduled: 8,
      inProgress: 4,
      completed: 7,
      upcoming: 5,
    };

    render(<ServicesKpis kpis={kpis} />);

    expect(screen.getByText("20")).toBeDefined();
    expect(screen.getByText("8")).toBeDefined();
    expect(screen.getByText("4")).toBeDefined();
    expect(screen.getByText("7")).toBeDefined();
    expect(screen.getByText("5")).toBeDefined();
  });
});

describe("ServicesFilters", () => {
  it("dispara onParamChange ao buscar ou filtrar por cliente", () => {
    const onParamChange = vi.fn();
    const customerOptions = [{ id: "cust-1", name: "Cliente Alpha" }];

    render(
      <ServicesFilters
        q=""
        status="all"
        customerId=""
        customerOptions={customerOptions}
        onParamChange={onParamChange}
      />,
    );

    const searchInput = screen.getByTestId("input-services-search");
    fireEvent.change(searchInput, { target: { value: "Manutenção" } });
    expect(onParamChange).toHaveBeenCalledWith("q", "Manutenção");

    const selectStatus = screen.getByTestId("select-services-status");
    fireEvent.change(selectStatus, { target: { value: "in_progress" } });
    expect(onParamChange).toHaveBeenCalledWith("status", "in_progress");

    const selectCust = screen.getByTestId("select-services-customer");
    fireEvent.change(selectCust, { target: { value: "cust-1" } });
    expect(onParamChange).toHaveBeenCalledWith("customerId", "cust-1");
  });
});

describe("ServicesTable", () => {
  it("renderiza lista de serviços e ações", () => {
    const onEdit = vi.fn();
    const onChangeStatus = vi.fn();
    const mockRow: ServiceRow = {
      id: "srv-12345678",
      title: "Instalação Elétrica",
      description: "Quadro de distribuição",
      status: "scheduled",
      statusLabel: "Agendado",
      statusTone: "accent",
      valueCents: 45000,
      valueLabel: "R$ 450,00",
      valueInput: "450,00",
      scheduleLabel: "15/05/2026",
      scheduleMetaLabel: "09:00 - 12:00",
      updatedAtLabel: "Hoje",
      customerId: "cust-1",
      customerName: "Cliente Alpha",
      customerLabel: "Cliente Alpha",
      appointmentId: "apt-1",
      appointmentDate: "2026-05-15",
      appointmentStartTime: "09:00",
      appointmentEndTime: "12:00",
      locationText: "Sede",
    };

    render(
      <ServicesTable
        rows={[mockRow]}
        onEdit={onEdit}
        onChangeStatus={onChangeStatus}
      />,
    );

    expect(screen.getByTestId("table-services-list")).toBeDefined();
    expect(screen.getByText("Instalação Elétrica")).toBeDefined();
    expect(screen.getByText("R$ 450,00")).toBeDefined();
  });
});
