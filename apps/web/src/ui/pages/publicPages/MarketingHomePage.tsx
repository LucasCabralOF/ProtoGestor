import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { FiArrowRight } from "react-icons/fi";
import { MarketingDifferentialsBar } from "./marketing-sections/MarketingDifferentialsBar";
import { MarketingFaqSection } from "./marketing-sections/MarketingFaqSection";
import { MarketingHeroSection } from "./marketing-sections/MarketingHeroSection";
import { MarketingInteractiveModules } from "./marketing-sections/MarketingInteractiveModules";
import { MarketingPainSolutionSection } from "./marketing-sections/MarketingPainSolutionSection";
import { MarketingPricingSection } from "./marketing-sections/MarketingPricingSection";
import { MarketingSegmentsSection } from "./marketing-sections/MarketingSegmentsSection";
import { PublicSiteShell } from "./PublicSiteShell";

export async function MarketingHomePage() {
  const t = await getTranslations("marketing");

  return (
    <PublicSiteShell currentPage="home">
      <div className="px-3 pb-10 pt-4 sm:px-6 sm:pb-12 sm:pt-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 sm:gap-14">
          {/* 1. Hero com headline impactante e CTAs */}
          <MarketingHeroSection />

          {/* 2. Barra de diferenciais */}
          <MarketingDifferentialsBar />

          {/* 3. As 4 Dores vs 4 Soluções */}
          <MarketingPainSolutionSection />

          {/* 4. Demonstração visual interativa dos módulos */}
          <MarketingInteractiveModules />

          {/* 5. Para quem é (segmentos de campo) */}
          <MarketingSegmentsSection />

          {/* 6. Tabela de Preços com os 3 planos */}
          <MarketingPricingSection />

          {/* 7. FAQ oficial */}
          <MarketingFaqSection />

          {/* 8. Chamada final para conversão */}
          <section className="rounded-xl border border-(--color-border) bg-(--color-base-2) p-5 sm:p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-(--color-text-2)">
                  {t("finalCta.eyebrow")}
                </p>
                <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                  {t("finalCta.title")}
                </h2>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm leading-6 sm:leading-7 text-(--color-text-2)">
                  {t("finalCta.body")}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-(--color-primary) px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold !text-white shadow-sm transition hover:brightness-110 hover:no-underline"
                  href="/signup"
                >
                  <span className="flex items-center gap-2 !text-white">
                    {t("finalCta.primaryCta")}
                    <FiArrowRight />
                  </span>
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-md border border-emerald-600/30 bg-white px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold !text-emerald-950 shadow-xs transition hover:bg-emerald-50 hover:no-underline dark:bg-(--color-base-1) dark:!text-emerald-100"
                  href="/login"
                >
                  <span className="!text-emerald-950 dark:!text-emerald-100">
                    {t("finalCta.secondaryCta")}
                  </span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PublicSiteShell>
  );
}
