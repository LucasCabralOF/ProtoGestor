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
      <div className="rounded-xl border border-(--color-border) bg-white p-4 sm:p-6 shadow-sm dark:bg-(--color-base-1) md:p-8">
        <p className="text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
          {t("features.eyebrow")}
        </p>
        <h2 className="mt-1.5 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
          {t("features.title")}
        </h2>
        <p className="mt-2 sm:mt-4 text-xs sm:text-sm leading-6 sm:leading-7 text-(--color-text-2)">
          {t("features.subtitle")}
        </p>

        <div className="mt-5 sm:mt-8 space-y-3 sm:space-y-4">
          {MARKETING_STEP_IDS.map((stepId, index) => (
            <div
              key={stepId}
              className="flex gap-3 sm:gap-4 rounded-xl border border-(--color-border) bg-(--color-base-2) p-3 sm:p-4"
            >
              <div className="flex flex-col items-center">
                <span className="inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-md bg-(--color-primary) text-xs sm:text-sm font-black text-white shadow-sm">
                  {index + 1}
                </span>
                {index < MARKETING_STEP_IDS.length - 1 ? (
                  <span className="mt-2 h-8 w-px bg-(--color-border)" />
                ) : null}
              </div>

              <div>
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-(--color-text-2)">
                  {t("steps.stepLabel", { value: index + 1 })}
                </p>
                <h3 className="mt-1 sm:mt-2 text-base sm:text-xl font-bold">
                  {t(`steps.items.${stepId}.title`)}
                </h3>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-7 text-(--color-text-2)">
                  {t(`steps.items.${stepId}.body`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        {MARKETING_FEATURE_IDS.map((featureId) => {
          const Icon = FEATURE_ICONS[featureId];

          return (
            <div
              key={featureId}
              className="rounded-xl border border-(--color-border) bg-white p-4 sm:p-6 shadow-sm dark:bg-(--color-base-1)"
            >
              <span className="inline-flex rounded-lg border border-(--color-border) bg-(--color-base-2) p-2.5 sm:p-3 text-(--color-primary)">
                <Icon size={18} />
              </span>
              <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-bold">
                {t(`features.items.${featureId}.title`)}
              </h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-7 text-(--color-text-2)">
                {t(`features.items.${featureId}.body`)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
