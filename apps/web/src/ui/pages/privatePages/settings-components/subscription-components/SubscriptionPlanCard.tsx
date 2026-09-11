import { FiAward, FiCheck } from "react-icons/fi";
import {
  type BillingCycle,
  formatSubscriptionPrice,
  SUBSCRIPTION_PLANS,
  type SubscriptionPlanId,
} from "@/lib/subscription-utils";
import { Button } from "@/ui/base/Button";

type SubscriptionPlanCardProps = {
  billingCycle: BillingCycle;
  isCurrent: boolean;
  isOwnerOrAdmin: boolean;
  isPending: boolean;
  onSelectPlan: (planId: SubscriptionPlanId) => void;
  planId: SubscriptionPlanId;
};

export function SubscriptionPlanCard({
  billingCycle,
  isCurrent,
  isOwnerOrAdmin,
  isPending,
  onSelectPlan,
  planId,
}: SubscriptionPlanCardProps) {
  const plan = SUBSCRIPTION_PLANS[planId];
  const priceFormatted = formatSubscriptionPrice(planId, billingCycle);

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
        isCurrent
          ? "border-(--color-primary) bg-emerald-500/5 ring-1 ring-emerald-500/30 shadow-sm"
          : "border-(--color-border) bg-(--color-base-1) hover:border-(--color-border-hover)"
      }`}
      data-testid={`subscription-plan-card-${planId}`}
    >
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-(--color-text-1)">
            {plan.name}
          </h3>
          {plan.badge && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              {plan.badge}
            </span>
          )}
        </div>

        <div className="mt-3">
          <span className="text-3xl font-black tracking-tight text-(--color-text-1)">
            {priceFormatted}
          </span>
          <span className="text-xs text-(--color-text-2)">/mês</span>
          {billingCycle === "yearly" && (
            <p className="text-[11px] text-emerald-600 font-semibold">
              Cobrado anualmente com 15% off
            </p>
          )}
        </div>

        <div className="mt-2 space-y-1 text-xs text-(--color-text-2)">
          <p>👥 {plan.maxUsersLabel}</p>
          <p>🏢 {plan.maxOrgsLabel}</p>
        </div>

        <ul className="mt-4 space-y-2 border-t border-(--color-border) pt-4 text-xs text-(--color-text-2)">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <FiCheck className="h-3.5 w-3.5 mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-4 border-t border-(--color-border)">
        {isCurrent ? (
          <Button className="w-full justify-center" disabled fit type="default">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
              <FiAward className="h-3.5 w-3.5" />
              Plano Atual
            </span>
          </Button>
        ) : (
          <Button
            className="w-full justify-center"
            disabled={isPending || !isOwnerOrAdmin}
            fit
            onClick={() => onSelectPlan(planId)}
            type="primary"
          >
            {isPending ? "Alterando..." : "Mudar para este Plano"}
          </Button>
        )}
      </div>
    </div>
  );
}
