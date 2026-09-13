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
    <section className="rounded-xl border border-(--color-border) bg-white p-4 sm:p-6 shadow-sm dark:bg-(--color-base-1) md:p-8">
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
            {t("pricingPreview.eyebrow")}
          </p>
          <h2 className="mt-1.5 sm:mt-3 text-2xl sm:text-3xl font-black tracking-tight">
            {t("pricingPreview.title")}
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-(--color-text-2)">
            {t("pricingPreview.subtitle")}
          </p>
        </div>

        <Link
          className="inline-flex items-center justify-center gap-2 rounded-md border border-emerald-600/30 bg-emerald-50/80 px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold text-emerald-900 shadow-xs transition hover:bg-emerald-100 hover:no-underline dark:bg-emerald-950/40 dark:border-emerald-700/50 dark:text-emerald-200"
          href="/pricing"
        >
          {t("pricingPreview.viewPlans")}
          <FiArrowRight />
        </Link>
      </div>

      <div
        className="mt-6 sm:mt-8 grid gap-4 lg:grid-cols-[0.92fr_1.08fr_0.92fr]"
        data-testid="marketing-pricing-preview"
      >
        {MARKETING_PRICING_PLANS.map((plan) => (
          <article
            key={plan.id}
            className={
              plan.id === featuredPlan.id
                ? "relative overflow-hidden rounded-xl border-2 border-(--color-primary) bg-white p-4 sm:p-6 shadow-md dark:bg-(--color-base-1)"
                : "rounded-xl border border-(--color-border) bg-(--color-base-2) p-4 sm:p-6"
            }
            data-testid={`pricing-plan-${plan.id}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base sm:text-lg font-bold">
                  {t(`plans.${plan.id}.name`)}
                </p>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-(--color-text-2)">
                  {t(`plans.${plan.id}.description`)}
                </p>
              </div>
              {plan.featured ? (
                <span className="rounded bg-(--color-primary) px-2.5 py-1 text-xs font-semibold text-white">
                  {t("plans.popularBadge")}
                </span>
              ) : null}
            </div>

            <div className="mt-5 sm:mt-6">
              <p className="text-3xl sm:text-4xl font-black tracking-tight">
                {formatMarketingPrice(locale, plan.priceCents)}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-(--color-text-2)">
                {t("plans.period")}
              </p>
            </div>

            <ul className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-(--color-text-2)">
              {(t.raw(`plans.${plan.id}.highlights`) as string[]).map(
                (highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2.5 sm:gap-3"
                  >
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
