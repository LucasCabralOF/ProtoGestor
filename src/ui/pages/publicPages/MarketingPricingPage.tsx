import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { FiArrowRight, FiCheck, FiZap } from "react-icons/fi";
import {
  formatMarketingPrice,
  getFeaturedMarketingPlan,
  MARKETING_FAQ_IDS,
  MARKETING_PRICING_PLANS,
} from "@/lib/public-site";
import type { AppLocale } from "@/utils/i18n";
import { PublicSiteShell } from "./PublicSiteShell";

type ComparisonRow = {
  founders: string;
  label: string;
  operation: string;
  team: string;
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
      <div className="px-6 pb-12 pt-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <section
            className="relative overflow-hidden rounded-[40px] border border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(255,255,255,0.78))] px-6 py-10 shadow-[0_30px_100px_rgba(15,23,42,0.10)] backdrop-blur dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(20,20,20,0.94),rgba(20,20,20,0.82))] md:px-10"
            data-testid="marketing-pricing"
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="marketing-float-fast absolute -right-12 top-8 h-48 w-48 rounded-full bg-[rgba(22,119,255,0.18)] blur-3xl" />
              <div className="marketing-float-slow absolute left-1/3 top-1/2 h-36 w-36 rounded-full bg-[rgba(16,185,129,0.12)] blur-3xl" />
            </div>

            <div className="relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
                  {t("pricingPage.eyebrow")}
                </p>
                <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                  {t("pricingPage.title")}
                </h1>
                <p className="mt-5 text-lg leading-8 text-(--color-text-2)">
                  {t("pricingPage.subtitle")}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {[
                    t("pricingPage.ribbon.trial"),
                    t("pricingPage.ribbon.manual"),
                    t("pricingPage.ribbon.value"),
                  ].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/78 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--color-text-2) shadow-[0_8px_24px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/6"
                    >
                      <FiZap className="text-(--color-primary)" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {decisionCards.map((card, index) => (
                  <div
                    key={card.title}
                    className={
                      index === 1
                        ? "rounded-[26px] border border-slate-900/12 bg-[linear-gradient(180deg,#0f172a,#13213f)] p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
                        : "rounded-[26px] border border-white/70 bg-white/82 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6"
                    }
                  >
                    <p
                      className={
                        index === 1
                          ? "text-lg font-bold text-white"
                          : "text-lg font-bold"
                      }
                    >
                      {card.title}
                    </p>
                    <p
                      className={
                        index === 1
                          ? "mt-3 text-sm leading-7 text-white/72"
                          : "mt-3 text-sm leading-7 text-(--color-text-2)"
                      }
                    >
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-[0.92fr_1.08fr_0.92fr]">
              {MARKETING_PRICING_PLANS.map((plan) => (
                <article
                  key={plan.id}
                  className={
                    plan.id === featuredPlan.id
                      ? "relative overflow-hidden rounded-[32px] border border-(--color-primary) bg-[linear-gradient(180deg,rgba(22,119,255,0.12),rgba(248,250,252,0.86))] p-6 shadow-[0_24px_70px_rgba(22,119,255,0.15)] dark:bg-[linear-gradient(180deg,rgba(22,119,255,0.20),rgba(16,16,16,0.88))]"
                      : "rounded-[32px] border border-(--color-border) bg-(--color-base-2) p-6"
                  }
                  data-testid={`pricing-page-plan-${plan.id}`}
                >
                  {plan.featured ? (
                    <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-[rgba(22,119,255,0.18)] blur-2xl" />
                  ) : null}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xl font-bold">
                        {t(`plans.${plan.id}.name`)}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-(--color-text-2)">
                        {t(`plans.${plan.id}.description`)}
                      </p>
                    </div>

                    {plan.featured ? (
                      <span className="rounded-full bg-(--color-primary) px-3 py-1 text-xs font-semibold text-white">
                        {t("plans.popularBadge")}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-8">
                    <p className="text-5xl font-black tracking-tight">
                      {formatMarketingPrice(locale, plan.priceCents)}
                    </p>
                    <p className="mt-2 text-sm text-(--color-text-2)">
                      {t("plans.period")}
                    </p>
                  </div>

                  <ul className="mt-8 space-y-3 text-sm text-(--color-text-2)">
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

                  <Link
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-(--color-primary) px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(22,119,255,0.24)] transition hover:brightness-110 hover:no-underline"
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
            <div className="rounded-[32px] border border-white/70 bg-white/78 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-[rgba(20,20,20,0.82)] md:p-8">
              <p className="text-sm font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
                {t("pricingPage.notesEyebrow")}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                {t("pricingPage.notesTitle")}
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {pricingNotes.map((note) => (
                <div
                  key={note}
                  className="rounded-[24px] border border-white/70 bg-white/78 p-5 text-sm leading-7 text-(--color-text-2) shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-[rgba(20,20,20,0.82)]"
                >
                  {note}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-white/70 bg-white/78 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-[rgba(20,20,20,0.82)] md:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
                  {t("pricingPage.comparison.eyebrow")}
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight">
                  {t("pricingPage.comparison.title")}
                </h2>
                <p className="mt-3 text-sm leading-7 text-(--color-text-2)">
                  {t("pricingPage.comparison.subtitle")}
                </p>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto">
              <div className="min-w-[760px] rounded-[28px] border border-(--color-border) bg-(--color-base-2) p-3">
                <div className="grid grid-cols-[1.2fr_0.6fr_0.6fr_0.6fr] gap-3">
                  <div className="rounded-[20px] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-(--color-text-2)">
                    {t("pricingPage.comparison.header.feature")}
                  </div>

                  {MARKETING_PRICING_PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      className={
                        plan.featured
                          ? "rounded-[20px] border border-(--color-primary) bg-white px-4 py-3 text-center text-sm font-bold shadow-[0_10px_30px_rgba(22,119,255,0.08)] dark:bg-white/8"
                          : "rounded-[20px] bg-white px-4 py-3 text-center text-sm font-bold shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:bg-white/6"
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
                      <div className="rounded-[20px] bg-white px-4 py-4 text-sm font-medium text-(--color-text-1) shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:bg-white/6">
                        {row.label}
                      </div>

                      {[row.founders, row.operation, row.team].map(
                        (value, index) => (
                          <div
                            key={`${row.label}-col-${index}`}
                            className={
                              index === 1
                                ? "rounded-[20px] border border-(--color-primary) bg-[rgba(22,119,255,0.08)] px-4 py-4 text-center text-sm font-semibold text-(--color-text-1)"
                                : "rounded-[20px] bg-white px-4 py-4 text-center text-sm font-semibold text-(--color-text-1) shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:bg-white/6"
                            }
                          >
                            {value}
                          </div>
                        ),
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/70 bg-white/78 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-[rgba(20,20,20,0.82)] md:p-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
                {t("pricingPage.faqEyebrow")}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                {t("pricingPage.faqTitle")}
              </h2>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {MARKETING_FAQ_IDS.map((faqId) => (
                <div
                  key={faqId}
                  className="rounded-[24px] border border-(--color-border) bg-(--color-base-2) p-5"
                >
                  <h3 className="text-lg font-bold">
                    {t(`faq.items.${faqId}.question`)}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-(--color-text-2)">
                    {t(`faq.items.${faqId}.answer`)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PublicSiteShell>
  );
}
