import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { FiArrowRight } from "react-icons/fi";
import { MarketingFeaturesSection } from "./marketing-sections/MarketingFeaturesSection";
import { MarketingHeroSection } from "./marketing-sections/MarketingHeroSection";
import { MarketingPricingSection } from "./marketing-sections/MarketingPricingSection";
import { MarketingProblemSection } from "./marketing-sections/MarketingProblemSection";
import { MarketingSegmentsSection } from "./marketing-sections/MarketingSegmentsSection";
import { PublicSiteShell } from "./PublicSiteShell";

export async function MarketingHomePage() {
  const t = await getTranslations("marketing");

  return (
    <PublicSiteShell currentPage="home">
      <div className="px-6 pb-12 pt-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-14">
          <MarketingHeroSection />
          <MarketingProblemSection />
          <MarketingFeaturesSection />
          <MarketingSegmentsSection />
          <MarketingPricingSection />

          <section className="rounded-[36px] border border-(--color-border) bg-[linear-gradient(135deg,rgba(22,119,255,0.10),rgba(255,255,255,0))] p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
                  {t("finalCta.eyebrow")}
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                  {t("finalCta.title")}
                </h2>
                <p className="mt-4 text-sm leading-7 text-(--color-text-2)">
                  {t("finalCta.body")}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-(--color-primary) px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(22,119,255,0.24)] transition hover:brightness-110 hover:no-underline"
                  href="/signup"
                >
                  {t("finalCta.primaryCta")}
                  <FiArrowRight />
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-full border border-(--color-border) bg-(--color-base-1) px-6 py-3 text-sm font-semibold text-(--color-text-1) hover:bg-(--color-base-2) hover:no-underline"
                  href="/login"
                >
                  {t("finalCta.secondaryCta")}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PublicSiteShell>
  );
}
