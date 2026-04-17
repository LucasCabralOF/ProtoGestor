import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import {
  formatMarketingPrice,
  getFeaturedMarketingPlan,
  MARKETING_PRICING_PLANS,
} from "@/lib/public-site";
import type { AppLocale } from "@/utils/i18n";

export async function MarketingPricingSection() {
  const t = await getTranslations("marketing");
  const locale = (await getLocale()) as AppLocale;
  const featuredPlan = getFeaturedMarketingPlan();

  return (
    <section className="rounded-[36px] border border-white/70 bg-white/78 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-[rgba(20,20,20,0.82)] md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
            {t("pricingPreview.eyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">
            {t("pricingPreview.title")}
          </h2>
          <p className="mt-3 text-sm leading-7 text-(--color-text-2)">
            {t("pricingPreview.subtitle")}
          </p>
        </div>

        <Link
          className="inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-base-2) px-5 py-3 text-sm font-semibold text-(--color-text-1) hover:bg-(--color-base-1) hover:no-underline"
          href="/pricing"
        >
          {t("pricingPreview.viewPlans")}
          <FiArrowRight />
        </Link>
      </div>

      <div
        className="mt-8 grid gap-4 lg:grid-cols-[0.92fr_1.08fr_0.92fr]"
        data-testid="marketing-pricing-preview"
      >
        {MARKETING_PRICING_PLANS.map((plan) => (
          <article
            key={plan.id}
            className={
              plan.id === featuredPlan.id
                ? "relative overflow-hidden rounded-[30px] border border-(--color-primary) bg-[linear-gradient(180deg,rgba(22,119,255,0.10),rgba(248,250,252,0.85))] p-6 shadow-[0_22px_60px_rgba(22,119,255,0.12)] dark:bg-[linear-gradient(180deg,rgba(22,119,255,0.18),rgba(16,16,16,0.88))]"
                : "rounded-[30px] border border-(--color-border) bg-(--color-base-2) p-6"
            }
            data-testid={`pricing-plan-${plan.id}`}
          >
            {plan.id === featuredPlan.id ? (
              <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-[rgba(22,119,255,0.18)] blur-2xl" />
            ) : null}

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-bold">
                  {t(`plans.${plan.id}.name`)}
                </p>
                <p className="mt-2 text-sm text-(--color-text-2)">
                  {t(`plans.${plan.id}.description`)}
                </p>
              </div>
              {plan.featured ? (
                <span className="rounded-full bg-(--color-primary) px-3 py-1 text-xs font-semibold text-white">
                  {t("plans.popularBadge")}
                </span>
              ) : null}
            </div>

            <div className="mt-6">
              <p className="text-4xl font-black tracking-tight">
                {formatMarketingPrice(locale, plan.priceCents)}
              </p>
              <p className="mt-1 text-sm text-(--color-text-2)">
                {t("plans.period")}
              </p>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-(--color-text-2)">
              {(t.raw(`plans.${plan.id}.highlights`) as string[]).map(
                (highlight) => (
                  <li key={highlight} className="flex items-start gap-3">
                    <span className="mt-0.5 text-(--color-primary)">
                      <FiCheck />
                    </span>
                    <span>{highlight}</span>
                  </li>
                ),
              )}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
