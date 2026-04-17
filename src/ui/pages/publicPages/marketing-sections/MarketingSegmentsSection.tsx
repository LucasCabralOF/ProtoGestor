import { getTranslations } from "next-intl/server";
import { MARKETING_SEGMENT_IDS } from "@/lib/public-site";

export async function MarketingSegmentsSection() {
  const t = await getTranslations("marketing");

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <div className="rounded-[34px] border border-white/70 bg-white/78 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-[rgba(20,20,20,0.82)] md:p-8">
        <p className="text-sm font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
          {t("segments.eyebrow")}
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight">
          {t("segments.title")}
        </h2>
        <p className="mt-3 text-sm leading-7 text-(--color-text-2)">
          {t("segments.subtitle")}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MARKETING_SEGMENT_IDS.map((segmentId, index) => (
          <div
            key={segmentId}
            className={
              index === 1 || index === 4
                ? "rounded-[24px] border border-slate-900/12 bg-[linear-gradient(135deg,#0f172a,#1e293b)] p-5 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]"
                : "rounded-[24px] border border-white/70 bg-white/78 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur dark:border-white/10 dark:bg-[rgba(20,20,20,0.82)]"
            }
          >
            <p
              className={
                index === 1 || index === 4
                  ? "text-base font-semibold text-white"
                  : "text-base font-semibold"
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
