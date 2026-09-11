// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { MemberRow } from "@/lib/members";
import type { OrganizationSummary } from "@/types/base";
import { SettingsCompanies } from "@/ui/pages/privatePages/settings-components/SettingsCompanies";
import { SettingsMembers } from "@/ui/pages/privatePages/settings-components/SettingsMembers";
import { SettingsSubscription } from "@/ui/pages/privatePages/settings-components/SettingsSubscription";

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

vi.mock("@/actions/(private)/members", () => ({
  addMemberAction: vi.fn(),
  removeMemberAction: vi.fn(),
  updateMemberRoleAction: vi.fn(),
}));

vi.mock("@/actions/(private)/subscription", () => ({
  updateOrganizationPlanAction: vi.fn().mockResolvedValue({
    data: { success: true, plan: "pro" },
  }),
}));

vi.mock("@/actions/onboardingActions", () => ({
  createOrganizationAction: vi.fn(),
  joinOrganizationAction: vi.fn(),
}));

describe("SettingsCompanies", () => {
  it("renderiza a lista de empresas e o botão de criar nova empresa", () => {
    const orgs: OrganizationSummary[] = [
      {
        id: "org-1",
        name: "Empresa Alfa",
        role: "owner",
        slug: "empresa-alfa",
      },
      {
        id: "org-2",
        name: "Empresa Beta",
        role: "member",
        slug: "empresa-beta",
      },
    ];

    render(<SettingsCompanies activeOrgId="org-1" organizations={orgs} />);

    expect(screen.getByText("Empresa Alfa")).toBeDefined();
    expect(screen.getByText("Empresa Beta")).toBeDefined();
    expect(screen.getByText("Empresa Ativa")).toBeDefined();
    expect(screen.getByTestId("button-settings-create-company")).toBeDefined();
  });
});

describe("SettingsMembers", () => {
  it("renderiza os colaboradores e código de acesso da empresa", () => {
    const members: MemberRow[] = [
      {
        id: "mem-1",
        userId: "u-1",
        name: "Carlos Gestor",
        email: "carlos@alfa.com",
        role: "owner",
        roleLabel: "Proprietário",
        joinedAtLabel: "01/01/2026",
        isCurrentUser: true,
      },
      {
        id: "mem-2",
        userId: "u-2",
        name: "Mariana Técnica",
        email: "mariana@alfa.com",
        role: "member",
        roleLabel: "Colaborador",
        joinedAtLabel: "10/02/2026",
        isCurrentUser: false,
      },
    ];

    render(
      <SettingsMembers
        currentRole="owner"
        members={members}
        orgName="Empresa Alfa"
        orgSlug="empresa-alfa"
      />,
    );

    expect(screen.getByText("Carlos Gestor (Você)")).toBeDefined();
    expect(screen.getByText("Mariana Técnica")).toBeDefined();
    expect(screen.getAllByText("empresa-alfa").length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getByTestId("button-settings-add-member")).toBeDefined();
  });

  it("oculta botões de gerenciamento quando o usuário é colaborador (member)", () => {
    const members: MemberRow[] = [
      {
        id: "mem-2",
        userId: "u-2",
        name: "Mariana Técnica",
        email: "mariana@alfa.com",
        role: "member",
        roleLabel: "Colaborador",
        joinedAtLabel: "10/02/2026",
        isCurrentUser: true,
      },
    ];

    render(
      <SettingsMembers
        currentRole="member"
        members={members}
        orgName="Empresa Alfa"
        orgSlug="empresa-alfa"
      />,
    );

    expect(screen.queryByTestId("button-settings-add-member")).toBeNull();
    expect(screen.queryByText("Copiar Código de Acesso")).toBeNull();
  });
});

describe("SettingsSubscription", () => {
  it("renderiza o plano atual e histórico de cobranças do SaaS", () => {
    render(
      <SettingsSubscription
        activePlan="starter"
        currentRole="owner"
        orgName="Climatização Total"
      />,
    );

    expect(screen.getByText("Plano & Faturamento SaaS")).toBeDefined();
    expect(screen.getByText(/Climatização Total/i)).toBeDefined();
    expect(screen.getByText("Histórico de Cobranças do SaaS")).toBeDefined();
    expect(screen.getByTestId("subscription-plan-card-starter")).toBeDefined();
    expect(screen.getByTestId("subscription-plan-card-pro")).toBeDefined();
    expect(
      screen.getByTestId("subscription-plan-card-enterprise"),
    ).toBeDefined();
  });

  it("exibe o banner de avaliação com dias restantes quando trialEndsAtIso é fornecido", () => {
    const futureDate = new Date(
      Date.now() + 10 * 24 * 60 * 60 * 1000,
    ).toISOString();

    render(
      <SettingsSubscription
        activePlan="starter"
        currentRole="owner"
        orgName="Climatização Total"
        trialEndsAtIso={futureDate}
      />,
    );

    expect(
      screen.getByText("Período de Avaliação Gratuita Ativo"),
    ).toBeDefined();
    expect(screen.getByText(/14 Dias Grátis/i)).toBeDefined();
  });

  it("permite alternar entre faturamento Mensal e Anual", () => {
    render(
      <SettingsSubscription
        activePlan="starter"
        currentRole="owner"
        orgName="Climatização Total"
      />,
    );

    const yearlyBtn = screen.getByRole("button", { name: /Anual/i });
    fireEvent.click(yearlyBtn);

    expect(screen.getAllByText(/Cobrado anualmente com 15% off/i).length).toBe(
      3,
    );
  });

  it("bloqueia mudança de plano para membros da equipe", () => {
    render(
      <SettingsSubscription
        activePlan="starter"
        currentRole="member"
        orgName="Climatização Total"
      />,
    );

    expect(
      screen.getByText(
        /A alteração de plano e faturamento da empresa é permitida apenas/i,
      ),
    ).toBeDefined();
  });
});
