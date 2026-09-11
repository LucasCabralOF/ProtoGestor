export type SubscriptionPlanId = "starter" | "pro" | "enterprise";
export type BillingCycle = "monthly" | "yearly";

export type PlanInfo = {
  id: SubscriptionPlanId;
  name: string;
  monthlyPriceCents: number;
  yearlyMonthlyEquivalentCents: number;
  maxUsersLabel: string;
  maxOrgsLabel: string;
  badge?: string;
  features: string[];
};

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlanId, PlanInfo> = {
  starter: {
    id: "starter",
    name: "Autônomo (Starter)",
    monthlyPriceCents: 4900,
    yearlyMonthlyEquivalentCents: 3900,
    maxUsersLabel: "1 usuário (proprietário)",
    maxOrgsLabel: "1 empresa",
    features: [
      "1 empresa cadastrada",
      "1 usuário da equipe",
      "Clientes, Agenda e OS",
      "Financeiro básico e cobrança",
      "Suporte via WhatsApp",
    ],
  },
  pro: {
    id: "pro",
    name: "Equipe (Pro)",
    monthlyPriceCents: 9900,
    yearlyMonthlyEquivalentCents: 7900,
    badge: "Mais Popular",
    maxUsersLabel: "Até 5 colaboradores",
    maxOrgsLabel: "1 empresa",
    features: [
      "1 empresa cadastrada",
      "Até 5 colaboradores de campo",
      "RBAC operacional para técnicos",
      "Automação de recorrência e ciclos",
      "Ficha 360° com WhatsApp e GPS",
      "Financeiro completo e relatórios",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Empresarial",
    monthlyPriceCents: 17900,
    yearlyMonthlyEquivalentCents: 14900,
    badge: "Sem Limites",
    maxUsersLabel: "Colaboradores ilimitados",
    maxOrgsLabel: "Múltiplas empresas",
    features: [
      "Múltiplas empresas e filiais ilimitadas",
      "Colaboradores ilimitados",
      "Tudo do plano Equipe Pro",
      "Auditoria completa de atividades (ActivityLog)",
      "Suporte prioritário VIP",
    ],
  },
};

export function normalizePlanId(plan?: string | null): SubscriptionPlanId {
  if (plan === "enterprise" || plan === "team") return "enterprise";
  if (plan === "pro" || plan === "operation") return "pro";
  return "starter";
}

export function getPlanDetails(plan?: string | null): PlanInfo {
  const planId = normalizePlanId(plan);
  return SUBSCRIPTION_PLANS[planId];
}

export function calculateTrialDaysRemaining(
  trialEndsAt?: Date | string | null,
  referenceDate: Date = new Date(),
): number {
  if (!trialEndsAt) return 0;
  const end =
    typeof trialEndsAt === "string" ? new Date(trialEndsAt) : trialEndsAt;
  const diffMs = end.getTime() - referenceDate.getTime();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function formatSubscriptionPrice(
  planId: SubscriptionPlanId,
  cycle: BillingCycle,
  locale = "pt-BR",
): string {
  const plan = SUBSCRIPTION_PLANS[planId];
  const cents =
    cycle === "yearly"
      ? plan.yearlyMonthlyEquivalentCents
      : plan.monthlyPriceCents;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export type SubscriptionInvoice = {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending";
  description: string;
};

export function getSimulatedSubscriptionInvoices(
  planId: SubscriptionPlanId,
  cycle: BillingCycle,
): SubscriptionInvoice[] {
  const price = formatSubscriptionPrice(planId, cycle);
  const planName = SUBSCRIPTION_PLANS[planId].name;

  return [
    {
      id: "inv-2026-09",
      date: "01/09/2026",
      amount: `${price}/mês`,
      status: "paid",
      description: `Mensalidade ProtoGestor SaaS — Plano ${planName}`,
    },
    {
      id: "inv-2026-08",
      date: "01/08/2026",
      amount: `${price}/mês`,
      status: "paid",
      description: `Mensalidade ProtoGestor SaaS — Plano ${planName}`,
    },
  ];
}
