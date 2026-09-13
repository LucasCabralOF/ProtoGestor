import { getTranslations } from "next-intl/server";
import { MARKETING_SEGMENT_IDS } from "@/lib/public-site";

export async function MarketingSegmentsSection() {
  const t = await getTranslations("marketing");

  return (
    <section className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <div className="rounded-xl border border-(--color-border) bg-white p-4 sm:p-6 shadow-sm dark:bg-(--color-base-1) md:p-8">
        <p className="text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
          {t("segments.eyebrow")}
        </p>
        <h2 className="mt-1.5 sm:mt-3 text-2xl sm:text-3xl font-black tracking-tight">
          {t("segments.title")}
        </h2>
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-(--color-text-2)">
          {t("segments.subtitle")}
        </p>
      </div>

      <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MARKETING_SEGMENT_IDS.map((segmentId, index) => (
          <div
            key={segmentId}
            className={
              index === 1 || index === 4
                ? "rounded-xl border border-emerald-900/60 bg-[#0c1f16] p-3.5 sm:p-5 text-white shadow-md"
                : "rounded-xl border border-(--color-border) bg-white p-3.5 sm:p-5 shadow-sm dark:bg-(--color-base-1)"
            }
          >
            <p
              className={
                index === 1 || index === 4
                  ? "text-sm sm:text-base font-semibold text-white"
                  : "text-sm sm:text-base font-semibold"
              }
            >
              {t(`segments.items.${segmentId}`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
