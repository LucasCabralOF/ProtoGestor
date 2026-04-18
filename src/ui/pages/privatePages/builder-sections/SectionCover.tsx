import type { useTranslations } from "next-intl";
import { FiFileText } from "react-icons/fi";
import type { ReportsData } from "@/lib/reports";

export function SectionCover({
  data,
  t,
  reportTitle,
  focusLabel,
  selectedSections,
  sectionLabel,
}: {
  data: ReportsData;
  t: ReturnType<typeof useTranslations>;
  reportTitle: string;
  focusLabel: () => string;
  selectedSections: string[];
  sectionLabel: (id: any) => string;
}) {
  return (
    <section className="report-print-section flex min-h-[240mm] flex-col justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          <FiFileText />
          {t("print.cover.badge")}
        </div>

        <h2 className="mt-8 max-w-3xl text-4xl font-black tracking-tight text-slate-900">
          {reportTitle}
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          {t("print.cover.description", { orgName: data.orgName })}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {t("print.cover.organization")}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {data.orgName}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {t("print.cover.focus")}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {focusLabel()}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {t("print.cover.period")}
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {data.periodLabel}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {t("print.cover.generatedAt")}
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {data.generatedAtLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t("print.cover.sectionsTitle")}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedSections.map((id) => (
            <span
              key={id}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700"
            >
              {sectionLabel(id)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
