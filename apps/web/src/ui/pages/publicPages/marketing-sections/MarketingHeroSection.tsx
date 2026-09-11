import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { FiArrowRight, FiCheck, FiMapPin, FiTrendingUp } from "react-icons/fi";

type HeroStat = {
  label: string;
  value: string;
};

type HeroPipelineItem = {
  count: string;
  label: string;
};

type HeroVisit = {
  client: string;
  service: string;
  status: string;
  time: string;
};

type HeroQueueItem = {
  label: string;
  value: string;
};

type ValueBandItem = {
  label: string;
  value: string;
};

export async function MarketingHeroSection() {
  const t = await getTranslations("marketing");
  const heroBadges = t.raw("hero.badges") as string[];
  const heroPipeline = t.raw("hero.mockPipeline") as HeroPipelineItem[];
  const heroQueue = t.raw("hero.mockQueue") as HeroQueueItem[];
  const heroStats = t.raw("hero.panelStats") as HeroStat[];
  const heroVisits = t.raw("hero.mockVisits") as HeroVisit[];
  const valueBandItems = t.raw("valueBand.items") as ValueBandItem[];

  return (
    <section
      className="relative overflow-hidden rounded-xl border border-(--color-border) bg-white px-4 py-6 shadow-sm dark:bg-(--color-base-1) sm:px-6 sm:py-8 lg:px-10 lg:py-12"
      data-testid="marketing-home"
    >
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)] lg:gap-12">
        <div className="flex flex-col gap-5 sm:gap-7">
          <span className="inline-flex w-fit rounded-md border border-(--color-border) bg-(--color-base-2) px-3 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-xs font-semibold tracking-[0.16em] uppercase text-(--color-text-2) shadow-sm">
            {t("hero.eyebrow")}
          </span>

          <div className="max-w-3xl">
            <h1
              className="max-w-3xl text-2xl font-black tracking-tight text-balance sm:text-4xl md:text-5xl xl:text-6xl"
              data-testid="marketing-hero"
            >
              {t("hero.title")}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-pretty text-(--color-text-2) sm:mt-5 sm:text-lg sm:leading-8">
              {t("hero.subtitle")}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-md bg-(--color-primary) px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 hover:no-underline"
              data-testid="marketing-cta-primary"
              href="/signup"
            >
              {t("hero.primaryCta")}
              <FiArrowRight />
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-md border border-(--color-border) bg-(--color-base-1) px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-(--color-text-1) transition hover:bg-(--color-base-2) hover:no-underline"
              data-testid="marketing-cta-secondary"
              href="/login"
            >
              {t("hero.secondaryCta")}
            </Link>
            <Link
              className="inline-flex items-center justify-center py-2 text-center text-sm font-semibold text-(--color-text-2) transition hover:text-(--color-primary) hover:no-underline sm:px-4 sm:py-3"
              href="/pricing"
            >
              {t("hero.pricingCta")}
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {heroBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 rounded-md border border-(--color-border) bg-(--color-base-1) px-2.5 py-1.5 text-xs font-medium text-(--color-text-2) shadow-sm"
              >
                <span className="text-(--color-primary)">
                  <FiCheck />
                </span>
                {badge}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-5 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6 text-white shadow-md">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-white/60">
                {t("valueBand.eyebrow")}
              </p>
              <h2 className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black tracking-tight">
                {t("valueBand.title")}
              </h2>
            </div>

            <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-3">
              {valueBandItems.map((item) => (
                <div
                  key={item.value}
                  className="rounded-lg border border-slate-700 bg-slate-800 p-3 sm:p-4"
                >
                  <p className="text-lg sm:text-xl font-black">{item.value}</p>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-white/68 text-balance">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="relative flex flex-col gap-4 lg:pl-4">
          <div className="rounded-xl border border-(--color-border) bg-(--color-base-1) p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
                  {t("hero.panelEyebrow")}
                </p>
                <h2 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-black tracking-tight">
                  {t("hero.panelTitle")}
                </h2>
              </div>

              <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                {t("hero.mockLive")}
              </div>
            </div>

            <div className="mt-4 sm:mt-5 grid grid-cols-3 gap-2 sm:gap-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col justify-between rounded-lg border border-(--color-border) bg-(--color-base-2) p-2.5 sm:p-4 shadow-sm"
                >
                  <p className="text-[10px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-(--color-text-2)">
                    {stat.label}
                  </p>
                  <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-black">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 sm:mt-5 flex flex-col gap-4">
              <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5 text-white shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.16em] uppercase text-white/55">
                      {t("hero.mockPipelineTitle")}
                    </p>
                    <p className="mt-1 sm:mt-2 text-base sm:text-lg font-bold">
                      {t("hero.mockPipelineSubtitle")}
                    </p>
                  </div>
                  <span className="inline-flex rounded-md bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white/72">
                    <FiTrendingUp />
                  </span>
                </div>

                <div className="mt-4 sm:mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                  {heroPipeline.map((item, index) => (
                    <div
                      key={item.label}
                      className={
                        index === 1
                          ? "rounded-lg border border-slate-700 bg-slate-800 p-2.5 sm:p-4"
                          : "rounded-lg border border-slate-700/50 bg-slate-800/50 p-2.5 sm:p-4"
                      }
                    >
                      <p className="text-lg sm:text-2xl font-black">
                        {item.count}
                      </p>
                      <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs uppercase tracking-[0.14em] text-white/55">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 sm:mt-5 rounded-lg border border-slate-700/50 bg-slate-800/50 p-3 sm:p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                    <FiMapPin />
                    {t("hero.mockVisitsTitle")}
                  </div>

                  <div className="mt-4 space-y-3">
                    {heroVisits.map((visit) => (
                      <div
                        key={`${visit.time}-${visit.client}`}
                        className="flex items-start justify-between gap-3 rounded-md border border-slate-700/50 bg-black/20 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-semibold">
                            {visit.client}
                          </p>
                          <p className="mt-1 text-xs text-white/62">
                            {visit.service}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold">{visit.time}</p>
                          <p className="mt-1 text-xs text-emerald-300">
                            {visit.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-xl border border-(--color-border) bg-(--color-base-1) p-5 shadow-sm">
                  <p className="text-xs font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
                    {t("hero.mockQueueTitle")}
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {heroQueue.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg border border-(--color-border) bg-(--color-base-2) p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--color-text-2)">
                          {item.label}
                        </p>
                        <p className="mt-2 text-2xl font-black">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-(--color-border) bg-(--color-base-1) p-5 shadow-sm">
                  <p className="text-xs font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
                    {t("hero.mockFocusLabel")}
                  </p>
                  <p className="mt-3 text-lg font-bold">
                    {t("hero.panelSubtitle")}
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      t("hero.mockFocusItems.clients"),
                      t("hero.mockFocusItems.schedule"),
                      t("hero.mockFocusItems.collections"),
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-md border border-(--color-border) bg-(--color-base-2) px-4 py-3 text-sm text-(--color-text-2)"
                      >
                        <span className="text-(--color-primary)">
                          <FiCheck />
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
