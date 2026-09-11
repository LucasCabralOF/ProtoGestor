// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MarketingInteractiveModules } from "@/ui/pages/publicPages/marketing-sections/MarketingInteractiveModules";

afterEach(() => {
  cleanup();
});

describe("MarketingInteractiveModules", () => {
  it("renderiza inicialmente na aba de Clientes com dados do Condomínio Solaris", () => {
    render(<MarketingInteractiveModules />);

    expect(screen.getByText("A operação completa na prática")).toBeDefined();
    expect(screen.getByText("Condomínio Solaris")).toBeDefined();
    expect(screen.getByText("Recorrente Mensal")).toBeDefined();
    expect(screen.getByText("Total já faturado")).toBeDefined();
  });

  it("permite alternar para a aba de Agenda e exibe visitas com horários", () => {
    render(<MarketingInteractiveModules />);

    const scheduleTabBtn = screen.getByRole("button", {
      name: /Agenda & Visitas/i,
    });
    fireEvent.click(scheduleTabBtn);

    expect(screen.getByText(/Visitas de Hoje/i)).toBeDefined();
    expect(screen.getByText("Hospital Santa Lúcia")).toBeDefined();
    expect(screen.getByText("08:30")).toBeDefined();
  });

  it("permite alternar para a aba de Ordens de Serviço e alterar status", () => {
    render(<MarketingInteractiveModules />);

    const ordersTabBtn = screen.getByRole("button", {
      name: /Ordens de Serviço/i,
    });
    fireEvent.click(ordersTabBtn);

    expect(screen.getByText("OS #204")).toBeDefined();
    expect(
      screen.getByText("Manutenção Preventiva e Troca de Filtros"),
    ).toBeDefined();
    expect(screen.getByText("R$ 680,00")).toBeDefined();

    const select = screen.getByLabelText("Status da OS") as HTMLSelectElement;
    expect(select.value).toBe("Concluída");

    fireEvent.change(select, { target: { value: "Em Andamento" } });
    expect(select.value).toBe("Em Andamento");
  });

  it("permite alternar para a aba de Financeiro e simular baixa de recebimento", () => {
    render(<MarketingInteractiveModules />);

    const financeTabBtn = screen.getByRole("button", {
      name: /Financeiro & Baixa/i,
    });
    fireEvent.click(financeTabBtn);

    expect(screen.getByText("Recebido no Mês")).toBeDefined();
    expect(screen.getByText("R$ 8.940,00")).toBeDefined();

    const payButton = screen.getByRole("button", { name: /Dar Baixa/i });
    fireEvent.click(payButton);

    expect(screen.getByText("Baixado / Pago")).toBeDefined();
  });
});
