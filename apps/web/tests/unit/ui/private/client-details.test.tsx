// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ClientDetailsData } from "@/lib/client-details-utils";
import { ClientDetailsHeader } from "@/ui/pages/privatePages/client-details-components/ClientDetailsHeader";
import { ClientFinancialSummary } from "@/ui/pages/privatePages/client-details-components/ClientFinancialSummary";
import { ClientQuickActions } from "@/ui/pages/privatePages/client-details-components/ClientQuickActions";
import { ClientServiceHistory } from "@/ui/pages/privatePages/client-details-components/ClientServiceHistory";

afterEach(() => {
  cleanup();
});

vi.mock("@/ui/base/useAppFeedback", () => ({
  useAppFeedback: () => ({
    notifySuccess: vi.fn(),
    notifyError: vi.fn(),
    confirm: vi.fn().mockResolvedValue(true),
  }),
}));

const mockClient: ClientDetailsData = {
  id: "client-123",
  name: "Maria da Silva",
  legalName: "Silva Comércio ME",
  document: "12.345.678/0001-90",
  phone: "11988887777",
  whatsapp: "11988887777",
  email: "maria@silva.com",
  notes: "Portão lateral de madeira. Ligar 10 min antes de chegar.",
  isActive: true,
  createdAtFormatted: "01/02/2026",
  addresses: [
    {
      id: "addr-1",
      isPrimary: true,
      label: "Sede",
      line1: "Av Paulista, 1000",
      line2: "Apto 101",
      city: "São Paulo",
      state: "SP",
      postalCode: "01310-100",
    },
  ],
  primaryAddress: {
    id: "addr-1",
    isPrimary: true,
    label: "Sede",
    line1: "Av Paulista, 1000",
    line2: "Apto 101",
    city: "São Paulo",
    state: "SP",
    postalCode: "01310-100",
  },
  tags: [
    { id: "tag-1", name: "VIP", color: "#10B981" },
    { id: "tag-2", name: "Recorrente", color: "#3B82F6" },
  ],
  stats: {
    totalOrders: 3,
    completedOrders: 2,
    inProgressOrders: 1,
    totalSpentCents: 150000,
    totalSpentFormatted: "R$ 1.500,00",
    pendingPaymentCents: 35000,
    pendingPaymentFormatted: "R$ 350,00",
  },
  serviceOrders: [
    {
      id: "so-1",
      title: "Manutenção Preventiva",
      description: "Revisão periódica de equipamentos",
      status: "completed",
      statusLabel: "Concluído",
      statusTone: "success",
      valueCents: 50000,
      valueFormatted: "R$ 500,00",
      createdAtFormatted: "05/02/2026",
      appointmentSummary: "10/02/2026 às 14:00 - 16:00 (Técnico João)",
    },
    {
      id: "so-2",
      title: "Instalação de Novo Ponto",
      description: "Passagem de cabeamento e testes",
      status: "in_progress",
      statusLabel: "Em Execução",
      statusTone: "accent",
      valueCents: 100000,
      valueFormatted: "R$ 1.000,00",
      createdAtFormatted: "15/02/2026",
      appointmentSummary: null,
    },
  ],
  transactions: [
    {
      id: "tx-1",
      description: "Pagamento OS #so-1",
      amountCents: 50000,
      amountFormatted: "R$ 500,00",
      type: "income",
      status: "paid",
      dueAtFormatted: "10/02/2026",
      paidAtFormatted: "10/02/2026",
      isOverdue: false,
    },
    {
      id: "tx-2",
      description: "Entrada OS #so-2",
      amountCents: 35000,
      amountFormatted: "R$ 350,00",
      type: "income",
      status: "pending",
      dueAtFormatted: "20/02/2026",
      paidAtFormatted: null,
      isOverdue: false,
    },
  ],
};

describe("ClientDetailsHeader", () => {
  it("renderiza os dados cadastrais, tags e contadores de OS", () => {
    render(<ClientDetailsHeader client={mockClient} />);

    expect(screen.getByText("Maria da Silva")).toBeDefined();
    expect(screen.getByText("MS")).toBeDefined();
    expect(screen.getByText("Razão Social: Silva Comércio ME")).toBeDefined();
    expect(screen.getByText("Documento: 12.345.678/0001-90")).toBeDefined();
    expect(screen.getByText("Ativo")).toBeDefined();
    expect(screen.getByText("#VIP")).toBeDefined();
    expect(screen.getByText("#Recorrente")).toBeDefined();
    expect(screen.getByText("3")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
  });

  it("renderiza status inativo quando isActive for false", () => {
    render(
      <ClientDetailsHeader
        client={{
          ...mockClient,
          isActive: false,
        }}
      />,
    );

    expect(screen.getByText("Inativo")).toBeDefined();
  });
});

describe("ClientQuickActions", () => {
  it("gera links funcionais de WhatsApp, Google Maps, Waze, telefone e e-mail", () => {
    render(
      <ClientQuickActions client={mockClient} orgName="Gestor Serviços" />,
    );

    const whatsappBtn = screen.getByTestId("button-whatsapp-client");
    expect(whatsappBtn.getAttribute("href")).toContain(
      "https://wa.me/5511988887777",
    );
    expect(whatsappBtn.getAttribute("href")).toContain("Maria%20da%20Silva");

    const mapsBtn = screen.getByTestId("button-maps-client");
    expect(mapsBtn.getAttribute("href")).toContain("google.com/maps/search");
    expect(mapsBtn.getAttribute("href")).toContain("Av%20Paulista");

    const wazeBtn = screen.getByTestId("button-waze-client");
    expect(wazeBtn.getAttribute("href")).toContain("waze.com/ul");
    expect(wazeBtn.getAttribute("href")).toContain("Av%20Paulista");

    const phoneBtn = screen.getByTestId("button-call-client");
    expect(phoneBtn.getAttribute("href")).toBe("tel:11988887777");

    const emailBtn = screen.getByTestId("button-email-client");
    expect(emailBtn.getAttribute("href")).toBe("mailto:maria@silva.com");

    expect(
      screen.getByText(
        "Portão lateral de madeira. Ligar 10 min antes de chegar.",
      ),
    ).toBeDefined();
  });

  it("permite copiar endereço com a API de clipboard", () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<ClientQuickActions client={mockClient} />);

    const copyBtn = screen.getByRole("button", { name: /copiar/i });
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith(
      "Av Paulista, 1000, Apto 101, São Paulo - SP, CEP: 01310-100",
    );
  });
});

describe("ClientServiceHistory", () => {
  it("renderiza timeline de atendimentos com status e agendamento", () => {
    render(
      <ClientServiceHistory
        clientId={mockClient.id}
        serviceOrders={mockClient.serviceOrders}
      />,
    );

    expect(screen.getByText("Manutenção Preventiva")).toBeDefined();
    expect(screen.getByText("Instalação de Novo Ponto")).toBeDefined();
    expect(screen.getByText("R$ 500,00")).toBeDefined();
    expect(screen.getByText("R$ 1.000,00")).toBeDefined();
    expect(
      screen.getByText(/Visita: 10\/02\/2026 às 14:00 - 16:00/),
    ).toBeDefined();
  });

  it("renderiza mensagem vazia quando não há ordens de serviço", () => {
    render(
      <ClientServiceHistory clientId={mockClient.id} serviceOrders={[]} />,
    );

    expect(screen.getByText("Nenhum atendimento registrado")).toBeDefined();
  });
});

describe("ClientFinancialSummary", () => {
  it("exibe faturamento e transações para owner e admin", () => {
    render(
      <ClientFinancialSummary
        clientName={mockClient.name}
        currentRole="owner"
        stats={mockClient.stats}
        transactions={mockClient.transactions}
      />,
    );

    expect(screen.getByText("R$ 1.500,00")).toBeDefined();
    expect(screen.getAllByText("R$ 350,00").length).toBe(2);
    expect(screen.getByText("Pagamento OS #so-1")).toBeDefined();
    expect(screen.getByText("Entrada OS #so-2")).toBeDefined();
  });

  it("oculta dados financeiros completamente para colaboradores (role member)", () => {
    const { container } = render(
      <ClientFinancialSummary
        clientName={mockClient.name}
        currentRole="member"
        stats={mockClient.stats}
        transactions={mockClient.transactions}
      />,
    );

    expect(container.firstChild).toBeNull();
    expect(screen.queryByText("Resumo Financeiro & Cobrança")).toBeNull();
    expect(screen.queryByText("R$ 1.500,00")).toBeNull();
  });
});
