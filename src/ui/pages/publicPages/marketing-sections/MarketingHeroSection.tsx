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
      className="relative overflow-hidden rounded-[40px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(255,255,255,0.78))] px-6 py-8 shadow-[0_30px_100px_rgba(15,23,42,0.10)] backdrop-blur dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(20,20,20,0.94),rgba(20,20,20,0.82))] lg:px-10 lg:py-12"
      data-testid="marketing-home"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="marketing-float-slow absolute -right-20 top-10 h-56 w-56 rounded-full bg-[rgba(22,119,255,0.15)] blur-3xl" />
        <div className="marketing-float-fast absolute left-1/3 top-1/2 h-44 w-44 rounded-full bg-[rgba(16,185,129,0.12)] blur-3xl" />
      </div>

      <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)]">
        <div className="flex flex-col gap-7">
          <span className="inline-flex w-fit rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase text-(--color-text-2) shadow-[0_10px_30px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/6">
            {t("hero.eyebrow")}
          </span>

          <div className="max-w-3xl">
            <h1
              className="max-w-3xl text-4xl font-black tracking-tight text-balance md:text-5xl xl:text-6xl"
              data-testid="marketing-hero"
            >
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-pretty text-(--color-text-2)">
              {t("hero.subtitle")}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full bg-(--color-primary) px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(22,119,255,0.24)] transition hover:brightness-110 hover:no-underline"
              data-testid="marketing-cta-primary"
              href="/signup"
            >
              {t("hero.primaryCta")}
              <FiArrowRight />
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/75 px-6 py-3 text-sm font-semibold text-(--color-text-1) transition hover:bg-(--color-base-2) hover:no-underline dark:border-white/10 dark:bg-white/6"
              data-testid="marketing-cta-secondary"
              href="/pricing"
            >
              {t("hero.secondaryCta")}
            </Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {heroBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 py-2 text-xs font-medium text-(--color-text-2) shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/6"
              >
                <span className="text-(--color-primary)">
                  <FiCheck />
                </span>
                {badge}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-6 rounded-[30px] border border-[rgba(15,23,42,0.08)] bg-[linear-gradient(180deg,#0f172a,#13213f)] px-6 py-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] dark:border-white/8">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-white/60">
                {t("valueBand.eyebrow")}
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight">
                {t("valueBand.title")}
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {valueBandItems.map((item) => (
                <div
                  key={item.value}
                  className="rounded-[24px] border border-white/8 bg-white/6 p-4"
                >
                  <p className="text-xl font-black">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-white/68 text-balance">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="relative flex flex-col gap-4 lg:pl-4">
          <div className="marketing-float-fast absolute -left-2 top-3 hidden h-18 w-18 rounded-full bg-[rgba(22,119,255,0.16)] blur-2xl lg:block" />

          <div className="rounded-[34px] border border-white/70 bg-white/80 p-5 shadow-[0_22px_70px_rgba(15,23,42,0.10)] backdrop-blur dark:border-white/10 dark:bg-[rgba(20,20,20,0.82)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
                  {t("hero.panelEyebrow")}
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  {t("hero.panelTitle")}
                </h2>
              </div>

              <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                {t("hero.mockLive")}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col justify-between rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/6"
                >
                  <p className="text-xs font-semibold tracking-[0.14em] uppercase text-(--color-text-2)">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-black">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-4">
              <div className="overflow-hidden rounded-[28px] border border-slate-900/12 bg-[linear-gradient(180deg,#0f172a,#13213f)] p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.16em] uppercase text-white/55">
                      {t("hero.mockPipelineTitle")}
                    </p>
                    <p className="mt-2 text-lg font-bold">
                      {t("hero.mockPipelineSubtitle")}
                    </p>
                  </div>
                  <span className="inline-flex rounded-full bg-white/8 px-3 py-2 text-xs font-semibold text-white/72">
                    <FiTrendingUp />
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {heroPipeline.map((item, index) => (
                    <div
                      key={item.label}
                      className={
                        index === 1
                          ? "rounded-[22px] border border-white/10 bg-white/10 p-4"
                          : "rounded-[22px] border border-white/8 bg-white/6 p-4"
                      }
                    >
                      <p className="text-2xl font-black">{item.count}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-white/55">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[22px] border border-white/10 bg-white/6 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                    <FiMapPin />
                    {t("hero.mockVisitsTitle")}
                  </div>

                  <div className="mt-4 space-y-3">
                    {heroVisits.map((visit) => (
                      <div
                        key={`${visit.time}-${visit.client}`}
                        className="flex items-start justify-between gap-3 rounded-[18px] border border-white/8 bg-black/10 px-4 py-3"
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
                          <p className="mt-1 text-xs text-sky-300">
                            {visit.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/6">
                  <p className="text-xs font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
                    {t("hero.mockQueueTitle")}
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {heroQueue.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[20px] border border-(--color-border) bg-(--color-base-2) p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--color-text-2)">
                          {item.label}
                        </p>
                        <p className="mt-2 text-2xl font-black">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/70 bg-white/82 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/6">
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
                        className="flex items-center gap-3 rounded-[18px] border border-(--color-border) bg-(--color-base-2) px-4 py-3 text-sm text-(--color-text-2)"
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
