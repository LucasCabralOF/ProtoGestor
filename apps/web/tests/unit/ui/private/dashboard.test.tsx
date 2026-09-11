// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { DashboardData } from "@/lib/dashboard-utils";
import type { ReturnAlertItem } from "@/lib/recurrence-utils";
import { DashboardPage } from "@/ui/pages/privatePages/DashboardPage";
import { DashboardKpis } from "@/ui/pages/privatePages/dashboard-components/DashboardKpis";
import { DashboardReturnAlerts } from "@/ui/pages/privatePages/dashboard-components/DashboardReturnAlerts";

afterEach(() => {
  cleanup();
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    if (params?.userName) return `Olá, ${params.userName}`;
    if (params?.value !== undefined) return `${key}:${params.value}`;
    return key;
  },
}));

vi.mock("@/ui/pages/privatePages/OnboardingChecklist", () => ({
  OnboardingChecklist: () => <div data-testid="onboarding-checklist-mock" />,
}));

vi.mock("@/ui/pages/privatePages/RecurrenceSuggestionModal", () => ({
  RecurrenceSuggestionModal: () => null,
}));

const mockData: DashboardData = {
  orgName: "Empresa Teste",
  kpis: {
    monthlyRevenueLabel: "R$ 15.000,00",
    monthlyRevenueDeltaPct: 12,
    activeClients: 42,
    newClientsThisMonth: 5,
    servicesThisWeek: 8,
    servicesCompletedThisWeek: 6,
    pendingIssues: 2,
  },
  recentActivity: [],
  returnAlerts: [],
  upcomingServices: [],
};

const mockAlerts: ReturnAlertItem[] = [
  {
    id: "app-1",
    customerId: "cust-1",
    customerName: "Maria Silva",
    customerPhone: "11988887777",
    serviceOrderId: "so-1",
    serviceTitle: "Limpeza de Piscina",
    recurrenceRule: "weekly",
    recurrenceRuleLabel: "Semanal",
    lastCompletedAt: new Date(2026, 4, 1),
    lastCompletedAtLabel: "01/05/2026",
    dueReturnDate: new Date(2026, 4, 8),
    dueReturnDateLabel: "08/05/2026",
    isOverdue: false,
    suggestedDate: "2026-05-08",
    suggestedStartTime: "09:00",
    suggestedEndTime: "10:00",
  },
  {
    id: "app-2",
    customerId: "cust-2",
    customerName: "Carlos Souza",
    customerPhone: "11999998888",
    serviceOrderId: "so-2",
    serviceTitle: "Manutenção de Ar-Condicionado",
    recurrenceRule: "monthly",
    recurrenceRuleLabel: "Mensal",
    lastCompletedAt: new Date(2026, 3, 10),
    lastCompletedAtLabel: "10/04/2026",
    dueReturnDate: new Date(2026, 4, 10),
    dueReturnDateLabel: "10/05/2026",
    isOverdue: true,
    suggestedDate: "2026-05-10",
    suggestedStartTime: "14:00",
    suggestedEndTime: "15:00",
  },
];

describe("DashboardPage RBAC", () => {
  it("exibe faturamento e onboarding checklist para proprietário (owner)", () => {
    render(
      <DashboardPage
        userName="Lucas"
        data={mockData}
        hasClients={true}
        hasServices={true}
        currentRole="owner"
      />,
    );

    expect(screen.getByTestId("onboarding-checklist-mock")).toBeDefined();
    expect(screen.getByText("R$ 15.000,00")).toBeDefined();
    expect(screen.getByText("monthlyRevenue")).toBeDefined();
  });

  it("oculta faturamento e onboarding checklist para colaborador (member), exibindo métricas operacionais", () => {
    render(
      <DashboardPage
        userName="Lucas"
        data={mockData}
        hasClients={true}
        hasServices={true}
        currentRole="member"
      />,
    );

    expect(screen.queryByTestId("onboarding-checklist-mock")).toBeNull();
    expect(screen.queryByText("R$ 15.000,00")).toBeNull();
    expect(screen.queryByText("monthlyRevenue")).toBeNull();
    expect(screen.getByText("Concluídos na Semana")).toBeDefined();
    expect(screen.getByText("Pendências em Aberto")).toBeDefined();
    expect(screen.getByText("6")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
  });
});

describe("DashboardKpis", () => {
  it("renderiza faturamento e taxa de crescimento para owner", () => {
    render(<DashboardKpis kpis={mockData.kpis} isMember={false} />);

    expect(screen.getByText("monthlyRevenue")).toBeDefined();
    expect(screen.getByText("R$ 15.000,00")).toBeDefined();
    expect(screen.getByText("growthRate")).toBeDefined();
    expect(screen.getByText("12%")).toBeDefined();
  });

  it("oculta faturamento e renderiza métricas de campo para member", () => {
    render(<DashboardKpis kpis={mockData.kpis} isMember={true} />);

    expect(screen.queryByText("monthlyRevenue")).toBeNull();
    expect(screen.queryByText("R$ 15.000,00")).toBeNull();
    expect(screen.getByText("Concluídos na Semana")).toBeDefined();
    expect(screen.getByText("6")).toBeDefined();
    expect(screen.getByText("Pendências em Aberto")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
  });
});

describe("DashboardReturnAlerts", () => {
  it("renderiza mensagem amigável quando todos os retornos estão em dia", () => {
    render(<DashboardReturnAlerts alerts={[]} />);

    expect(screen.getByText("Todos os ciclos em dia!")).toBeDefined();
    expect(
      screen.getByText(
        "Nenhum cliente recorrente com visita pendente de agendamento neste mês.",
      ),
    ).toBeDefined();
  });

  it("renderiza lista de clientes com alertas de retorno, badges de atraso e link WhatsApp", () => {
    const onSchedule = vi.fn();
    render(
      <DashboardReturnAlerts
        alerts={mockAlerts}
        onScheduleReturn={onSchedule}
        orgName="ClimaTech"
      />,
    );

    expect(screen.getByText("Retornos e Recorrências do Mês")).toBeDefined();
    expect(screen.getByText("2 clientes")).toBeDefined();
    expect(screen.getByText("Maria Silva")).toBeDefined();
    expect(screen.getByText("Carlos Souza")).toBeDefined();
    expect(screen.getByText("Semanal")).toBeDefined();
    expect(screen.getByText("Mensal")).toBeDefined();
    expect(screen.getByText(/Atrasado/)).toBeDefined();

    const waBtn = screen.getByTestId("whatsapp-alert-cust-1");
    expect(waBtn.getAttribute("href")).toContain("https://wa.me/5511988887777");
    expect(waBtn.getAttribute("href")).toContain("Maria%20Silva");

    const scheduleBtn = screen.getByTestId("schedule-alert-cust-1");
    fireEvent.click(scheduleBtn);
    expect(onSchedule).toHaveBeenCalledWith(mockAlerts[0]);
  });
});
