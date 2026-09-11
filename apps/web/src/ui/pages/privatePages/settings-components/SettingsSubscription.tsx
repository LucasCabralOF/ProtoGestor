"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FiClock, FiInfo } from "react-icons/fi";
import { updateOrganizationPlanAction } from "@/actions/(private)/subscription";
import {
  type BillingCycle,
  calculateTrialDaysRemaining,
  getPlanDetails,
  getSimulatedSubscriptionInvoices,
  normalizePlanId,
  SUBSCRIPTION_PLANS,
  type SubscriptionPlanId,
} from "@/lib/subscription-utils";
import type { OrgRoleKey } from "@/types/base";
import { Card } from "@/ui/base/Card";
import { SubscriptionInvoiceHistory } from "./subscription-components/SubscriptionInvoiceHistory";
import { SubscriptionPlanCard } from "./subscription-components/SubscriptionPlanCard";

type SettingsSubscriptionProps = {
  activePlan?: string | null;
  currentRole: OrgRoleKey;
  orgName: string;
  trialEndsAtIso?: string | null;
};

export function SettingsSubscription({
  activePlan,
  currentRole,
  orgName,
  trialEndsAtIso,
}: SettingsSubscriptionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const currentPlanId = normalizePlanId(activePlan);
  const currentPlanInfo = getPlanDetails(currentPlanId);
  const trialDaysRemaining = calculateTrialDaysRemaining(trialEndsAtIso);
  const isOwnerOrAdmin = currentRole === "owner" || currentRole === "admin";
  const simulatedInvoices = getSimulatedSubscriptionInvoices(
    currentPlanId,
    billingCycle,
  );

  async function handleSelectPlan(planId: SubscriptionPlanId) {
    if (planId === currentPlanId || !isOwnerOrAdmin) return;
    setFeedbackMsg(null);

    startTransition(async () => {
      const res = await updateOrganizationPlanAction({ plan: planId });
      if (res?.data?.success) {
        setFeedbackMsg(
          `Plano alterado com sucesso para ${SUBSCRIPTION_PLANS[planId].name}!`,
        );
        router.refresh();
      } else {
        setFeedbackMsg(res?.serverError ?? "Não foi possível alterar o plano.");
      }
    });
  }

  return (
    <Card className="border border-(--color-border)">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">
              Plano & Faturamento SaaS
            </h2>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              {currentPlanInfo.name}
            </span>
          </div>
          <p className="mt-1 text-xs text-(--color-text-2)">
            Gerencie a assinatura do Confiança Gestor para a empresa{" "}
            <strong className="text-(--color-text-1)">{orgName}</strong>.
          </p>
        </div>

        {/* Alternador de Ciclo: Mensal vs Anual */}
        <div className="inline-flex items-center rounded-xl border border-(--color-border) bg-(--color-base-2) p-1">
          <button
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              billingCycle === "monthly"
                ? "bg-(--color-base-1) text-(--color-text-1) shadow-xs"
                : "text-(--color-text-2) hover:text-(--color-text-1)"
            }`}
            onClick={() => setBillingCycle("monthly")}
            type="button"
          >
            Mensal
          </button>
          <button
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              billingCycle === "yearly"
                ? "bg-(--color-base-1) text-(--color-text-1) shadow-xs"
                : "text-(--color-text-2) hover:text-(--color-text-1)"
            }`}
            onClick={() => setBillingCycle("yearly")}
            type="button"
          >
            Anual
            <span className="rounded bg-emerald-500/15 px-1 py-0.2 text-[10px] text-emerald-600 font-bold">
              -15%
            </span>
          </button>
        </div>
      </div>

      {/* Banner de Período de Testes */}
      {trialDaysRemaining > 0 && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FiClock className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-bold text-(--color-text-1)">
                Período de Avaliação Gratuita Ativo
              </p>
              <p className="text-xs text-(--color-text-2)">
                Você tem acesso a todas as funcionalidades. Restam{" "}
                <strong className="text-emerald-600 dark:text-emerald-400">
                  {trialDaysRemaining}{" "}
                  {trialDaysRemaining === 1 ? "dia" : "dias"}
                </strong>{" "}
                de teste grátis.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-(--color-primary) px-3 py-1 text-xs font-bold text-white shadow-xs">
            14 Dias Grátis
          </span>
        </div>
      )}

      {feedbackMsg && (
        <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-bold text-emerald-600">
          {feedbackMsg}
        </div>
      )}

      {!isOwnerOrAdmin && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-600">
          <FiInfo className="h-4 w-4 shrink-0" />
          <span>
            A alteração de plano e faturamento da empresa é permitida apenas
            para o proprietário ou administradores.
          </span>
        </div>
      )}

      {/* Grade de Seleção dos 3 Planos */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {(["starter", "pro", "enterprise"] as const).map((planId) => (
          <SubscriptionPlanCard
            key={planId}
            billingCycle={billingCycle}
            isCurrent={planId === currentPlanId}
            isOwnerOrAdmin={isOwnerOrAdmin}
            isPending={isPending}
            onSelectPlan={handleSelectPlan}
            planId={planId}
          />
        ))}
      </div>

      {/* Histórico Simulado de Faturas da Plataforma */}
      <SubscriptionInvoiceHistory invoices={simulatedInvoices} />
    </Card>
  );
}
