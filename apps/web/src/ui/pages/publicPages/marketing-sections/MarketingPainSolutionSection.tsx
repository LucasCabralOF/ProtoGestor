import { getTranslations } from "next-intl/server";
import { FiAlertCircle, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { MARKETING_PAIN_SOLUTION_IDS } from "@/lib/public-site";

export async function MarketingPainSolutionSection() {
  const t = await getTranslations("marketing");

  return (
    <section
      className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6 text-white shadow-md lg:p-10"
      data-testid="marketing-pain-solution"
    >
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
          {t("painSolution.eyebrow")}
        </p>
        <h2 className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
          {t("painSolution.title")}
        </h2>
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-white/70">
          {t("painSolution.subtitle")}
        </p>
      </div>

      <div className="mt-5 sm:mt-8 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        {MARKETING_PAIN_SOLUTION_IDS.map((id) => (
          <div
            key={id}
            className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/6 p-4 sm:p-6 backdrop-blur transition hover:bg-white/8"
          >
            {/* O Problema */}
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-md bg-red-500/15 text-red-400">
                <FiAlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>
              <div>
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-red-300">
                  {t("painSolution.withoutLabel")}
                </p>
                <p className="mt-1 text-xs sm:text-sm leading-5 sm:leading-6 text-white/80">
                  {t(`painSolution.items.${id}.pain`)}
                </p>
              </div>
            </div>

            {/* Divisor com seta */}
            <div className="my-3 sm:my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md bg-white/10 text-xs text-emerald-300">
                <FiArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* A Solução */}
            <div className="flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 sm:p-4">
              <span className="mt-0.5 inline-flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-300">
                <FiCheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>
              <div>
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                  {t("painSolution.withLabel")}
                </p>
                <p className="mt-1 text-xs sm:text-sm font-medium leading-5 sm:leading-6 text-emerald-50">
                  {t(`painSolution.items.${id}.solution`)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
