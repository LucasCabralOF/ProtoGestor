import { getTranslations } from "next-intl/server";
import {
  FiBarChart2,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiUsers,
} from "react-icons/fi";
import { MARKETING_FEATURE_IDS, MARKETING_STEP_IDS } from "@/lib/public-site";

const FEATURE_ICONS = {
  clients: FiUsers,
  schedule: FiCalendar,
  orders: FiFileText,
  finance: FiDollarSign,
  reports: FiBarChart2,
} as const;

export async function MarketingFeaturesSection() {
  const t = await getTranslations("marketing");

  return (
    <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="rounded-[34px] border border-white/70 bg-white/78 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-[rgba(20,20,20,0.82)] md:p-8">
        <p className="text-sm font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
          {t("features.eyebrow")}
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
          {t("features.title")}
        </h2>
        <p className="mt-4 text-sm leading-7 text-(--color-text-2)">
          {t("features.subtitle")}
        </p>

        <div className="mt-8 space-y-4">
          {MARKETING_STEP_IDS.map((stepId, index) => (
            <div
              key={stepId}
              className="flex gap-4 rounded-[24px] border border-(--color-border) bg-(--color-base-2) p-4"
            >
              <div className="flex flex-col items-center">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-(--color-primary) text-sm font-black text-white shadow-[0_12px_24px_rgba(22,119,255,0.24)]">
                  {index + 1}
                </span>
                {index < MARKETING_STEP_IDS.length - 1 ? (
                  <span className="mt-2 h-8 w-px bg-[linear-gradient(180deg,rgba(22,119,255,0.6),rgba(22,119,255,0))]" />
                ) : null}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--color-text-2)">
                  {t("steps.stepLabel", { value: index + 1 })}
                </p>
                <h3 className="mt-2 text-xl font-bold">
                  {t(`steps.items.${stepId}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-7 text-(--color-text-2)">
                  {t(`steps.items.${stepId}.body`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {MARKETING_FEATURE_IDS.map((featureId) => {
          const Icon = FEATURE_ICONS[featureId];

          return (
            <div
              key={featureId}
              className="rounded-[26px] border border-white/70 bg-white/78 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-[rgba(20,20,20,0.82)]"
            >
              <span className="inline-flex rounded-2xl border border-(--color-border) bg-(--color-base-2) p-3 text-(--color-primary)">
                <Icon size={18} />
              </span>
              <h3 className="mt-4 text-lg font-bold">
                {t(`features.items.${featureId}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-7 text-(--color-text-2)">
                {t(`features.items.${featureId}.body`)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
