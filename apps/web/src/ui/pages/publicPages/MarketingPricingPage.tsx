import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { FiArrowRight, FiCheck, FiZap } from "react-icons/fi";
import {
  formatMarketingPrice,
  getFeaturedMarketingPlan,
  MARKETING_PRICING_PLANS,
} from "@/lib/public-site";
import type { AppLocale } from "@/utils/i18n";
import { MarketingFaqSection } from "./marketing-sections/MarketingFaqSection";
import { PublicSiteShell } from "./PublicSiteShell";

type ComparisonRow = {
  enterprise?: string;
  founders?: string;
  label: string;
  operation?: string;
  pro?: string;
  starter?: string;
  team?: string;
};

type DecisionCard = {
  body: string;
  title: string;
};

export async function MarketingPricingPage() {
  const t = await getTranslations("marketing");
  const locale = (await getLocale()) as AppLocale;
  const comparisonRows = t.raw(
    "pricingPage.comparison.rows",
  ) as ComparisonRow[];
  const decisionCards = t.raw("pricingPage.decisionCards") as DecisionCard[];
  const featuredPlan = getFeaturedMarketingPlan();
  const pricingNotes = t.raw("pricingPage.notes") as string[];

  return (
    <PublicSiteShell currentPage="pricing">
      <div className="px-3 pb-10 pt-4 sm:px-6 sm:pb-12 sm:pt-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 sm:gap-10">
          <section
            className="relative overflow-hidden rounded-xl border border-(--color-border) bg-white px-4 py-6 shadow-sm dark:bg-(--color-base-1) sm:px-6 sm:py-10 md:px-10"
            data-testid="marketing-pricing"
          >
            <div className="relative grid gap-6 sm:gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="max-w-3xl">
                <p className="text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
                  {t("pricingPage.eyebrow")}
                </p>
                <h1 className="mt-2 sm:mt-3 text-2xl sm:text-4xl md:text-5xl font-black tracking-tight">
                  {t("pricingPage.title")}
                </h1>
                <p className="mt-3 sm:mt-5 text-sm sm:text-lg leading-relaxed sm:leading-8 text-(--color-text-2)">
                  {t("pricingPage.subtitle")}
                </p>

                <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
                  {[
                    t("pricingPage.ribbon.trial"),
                    t("pricingPage.ribbon.manual"),
                    t("pricingPage.ribbon.value"),
                  ].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 sm:gap-2 rounded-md border border-(--color-border) bg-(--color-base-2) px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--color-text-2) shadow-sm"
                    >
                      <FiZap className="text-(--color-primary)" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
                {decisionCards.map((card, index) => (
                  <div
                    key={card.title}
                    className={
                      index === 1
                        ? "rounded-lg border border-emerald-900/60 bg-[#0c1f16] p-4 sm:p-5 text-white shadow-md"
                        : "rounded-lg border border-(--color-border) bg-(--color-base-1) p-4 sm:p-5 shadow-sm"
                    }
                  >
                    <p
                      className={
                        index === 1
                          ? "text-base sm:text-lg font-bold text-white"
                          : "text-base sm:text-lg font-bold"
                      }
                    >
                      {card.title}
                    </p>
                    <p
                      className={
                        index === 1
                          ? "mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-7 text-white/72"
                          : "mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-7 text-(--color-text-2)"
                      }
                    >
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 sm:mt-8 grid gap-4 lg:grid-cols-[0.92fr_1.08fr_0.92fr]">
              {MARKETING_PRICING_PLANS.map((plan) => (
                <article
                  key={plan.id}
                  className={
                    plan.id === featuredPlan.id
                      ? "relative overflow-hidden rounded-xl border-2 border-(--color-primary) bg-white p-5 sm:p-6 shadow-md dark:bg-black"
                      : "rounded-xl border border-(--color-border) bg-(--color-base-2) p-5 sm:p-6"
                  }
                  data-testid={`pricing-page-plan-${plan.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg sm:text-xl font-bold">
                        {t(`plans.${plan.id}.name`)}
                      </p>
                      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-7 text-(--color-text-2)">
                        {t(`plans.${plan.id}.description`)}
                      </p>
                    </div>

                    {plan.featured ? (
                      <span className="rounded bg-(--color-primary) px-2.5 py-1 text-xs font-semibold text-white">
                        {t("plans.popularBadge")}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-6 sm:mt-8">
                    <p className="text-3xl sm:text-5xl font-black tracking-tight">
                      {formatMarketingPrice(locale, plan.priceCents)}
                    </p>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-(--color-text-2)">
                      {t("plans.period")}
                    </p>
                  </div>

                  <ul className="mt-6 sm:mt-8 space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-(--color-text-2)">
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

                  <Link
                    className="mt-6 sm:mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md bg-(--color-primary) px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 hover:no-underline"
                    href={plan.ctaHref}
                  >
                    {t(`plans.${plan.id}.cta`)}
                    <FiArrowRight />
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="rounded-xl border border-(--color-border) bg-white p-4 sm:p-6 shadow-sm dark:bg-(--color-base-1) md:p-8">
              <p className="text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
                {t("pricingPage.notesEyebrow")}
              </p>
              <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-black tracking-tight">
                {t("pricingPage.notesTitle")}
              </h2>
            </div>

            <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
              {pricingNotes.map((note) => (
                <div
                  key={note}
                  className="rounded-lg border border-(--color-border) bg-(--color-base-1) p-4 sm:p-5 text-xs sm:text-sm leading-6 sm:leading-7 text-(--color-text-2) shadow-sm"
                >
                  {note}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-(--color-border) bg-white p-4 sm:p-6 shadow-sm dark:bg-(--color-base-1) md:p-8">
            <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
                  {t("pricingPage.comparison.eyebrow")}
                </p>
                <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-black tracking-tight">
                  {t("pricingPage.comparison.title")}
                </h2>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-(--color-text-2)">
                  {t("pricingPage.comparison.subtitle")}
                </p>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="min-w-[760px] rounded-lg border border-(--color-border) bg-(--color-base-2) p-3">
                <div className="grid grid-cols-[1.2fr_0.6fr_0.6fr_0.6fr] gap-3">
                  <div className="rounded-md px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-(--color-text-2)">
                    {t("pricingPage.comparison.header.feature")}
                  </div>

                  {MARKETING_PRICING_PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      className={
                        plan.featured
                          ? "rounded-md border border-(--color-primary) bg-(--color-base-1) px-4 py-3 text-center text-sm font-bold shadow-sm"
                          : "rounded-md bg-(--color-base-1) px-4 py-3 text-center text-sm font-bold shadow-sm"
                      }
                    >
                      {t(`plans.${plan.id}.name`)}
                    </div>
                  ))}
                </div>

                <div className="mt-3 space-y-3">
                  {comparisonRows.map((row) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-[1.2fr_0.6fr_0.6fr_0.6fr] gap-3"
                    >
                      <div className="rounded-md bg-(--color-base-1) px-4 py-4 text-sm font-medium text-(--color-text-1) shadow-sm">
                        {row.label}
                      </div>

                      {[
                        row.starter ?? row.founders ?? "",
                        row.pro ?? row.operation ?? "",
                        row.enterprise ?? row.team ?? "",
                      ].map((value, index) => (
                        <div
                          key={`${row.label}-col-${index}`}
                          className={
                            index === 1
                              ? "rounded-md border border-(--color-primary) bg-[rgba(22,119,255,0.08)] px-4 py-4 text-center text-sm font-semibold text-(--color-text-1)"
                              : "rounded-md bg-(--color-base-1) px-4 py-4 text-center text-sm font-semibold text-(--color-text-1) shadow-sm"
                          }
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <MarketingFaqSection />
        </div>
      </div>
    </PublicSiteShell>
  );
}
