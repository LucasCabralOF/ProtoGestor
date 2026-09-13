import { getTranslations } from "next-intl/server";
import { MARKETING_FAQ_IDS } from "@/lib/public-site";

export async function MarketingFaqSection() {
  const t = await getTranslations("marketing");

  return (
    <section
      className="rounded-xl border border-(--color-border) bg-white p-4 sm:p-6 shadow-sm dark:bg-(--color-base-1) md:p-8"
      data-testid="marketing-faq"
    >
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--color-primary)">
          {t("pricingPage.faqEyebrow")}
        </p>
        <h2 className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
          {t("pricingPage.faqTitle")}
        </h2>
      </div>

      <div className="mt-5 sm:mt-8 grid gap-3 sm:gap-4 lg:grid-cols-2">
        {MARKETING_FAQ_IDS.map((faqId) => (
          <div
            key={faqId}
            className="rounded-lg border border-(--color-border) bg-(--color-base-2) p-4 sm:p-6 transition hover:border-emerald-500/50"
          >
            <h3 className="text-sm sm:text-base font-bold text-emerald-950 dark:text-emerald-50">
              {t(`faq.items.${faqId}.question`)}
            </h3>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-(--color-text-2)">
              {t(`faq.items.${faqId}.answer`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
