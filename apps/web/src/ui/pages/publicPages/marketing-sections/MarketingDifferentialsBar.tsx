import { getTranslations } from "next-intl/server";
import { FiFeather, FiGlobe, FiLayers, FiZap } from "react-icons/fi";
import { MARKETING_DIFFERENTIAL_IDS } from "@/lib/public-site";

const DIFFERENTIAL_ICONS = {
  setup: FiZap,
  multiOrg: FiLayers,
  noErpWeight: FiFeather,
  brazilFit: FiGlobe,
} as const;

export async function MarketingDifferentialsBar() {
  const t = await getTranslations("marketing");

  return (
    <section
      className="rounded-xl border border-(--color-border) bg-white p-4 sm:p-6 shadow-sm dark:bg-(--color-base-1) lg:p-8"
      data-testid="marketing-differentials"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--color-primary)">
            {t("differentials.eyebrow")}
          </p>
          <h2 className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-black tracking-tight md:text-3xl">
            {t("differentials.title")}
          </h2>
        </div>
        <p className="max-w-md text-xs sm:text-sm text-(--color-text-2)">
          {t("differentials.subtitle")}
        </p>
      </div>

      <div className="mt-5 sm:mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {MARKETING_DIFFERENTIAL_IDS.map((id) => {
          const Icon = DIFFERENTIAL_ICONS[id];

          return (
            <div
              key={id}
              className="flex flex-col justify-between rounded-lg border border-(--color-border) bg-(--color-base-2) p-4 sm:p-5 transition hover:border-(--color-primary)/40 hover:shadow-sm"
            >
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-md bg-emerald-500/10 text-(--color-primary)">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="mt-3 sm:mt-4">
                <h3 className="text-sm sm:text-base font-bold text-(--color-text-1)">
                  {t(`differentials.items.${id}.title`)}
                </h3>
                <p className="mt-1 sm:mt-2 text-xs leading-5 text-(--color-text-2)">
                  {t(`differentials.items.${id}.description`)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
