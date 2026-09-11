"use client";

import { useTranslations } from "next-intl";
import type { ChangeEvent } from "react";
import { useState } from "react";
import {
  FiCheckSquare,
  FiLayers,
  FiPrinter,
  FiRotateCcw,
  FiSliders,
} from "react-icons/fi";
import type { ReportsData } from "@/lib/reports";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { Input } from "@/ui/base/Input";
import { getSectionConfigs } from "./builder-sections/ReportSectionConfigs";
import type {
  PrintablePreset,
  PrintableSectionId,
} from "./builder-sections/types";
import {
  buildPrintablePages,
  defaultPrintableSections,
  presetSections,
  sectionBadgeClass,
} from "./builder-sections/utils";

export function PrintableReportBuilder({ data }: { data: ReportsData }) {
  const t = useTranslations("reports");

  const defaultTitle = t("print.defaultTitle", { orgName: data.orgName });
  const [reportTitle, setReportTitle] = useState(defaultTitle);
  const [selectedSections, setSelectedSections] = useState<
    PrintableSectionId[]
  >(() => defaultPrintableSections(data.filters.focus));

  function sectionLabel(id: PrintableSectionId) {
    return t(`print.sections.${id}.label`);
  }

  function sectionDescription(id: PrintableSectionId) {
    return t(`print.sections.${id}.description`);
  }

  function focusLabel() {
    if (data.filters.focus === "finance") {
      return t("filters.focusFinance");
    }

    if (data.filters.focus === "operations") {
      return t("filters.focusOperations");
    }

    return t("filters.focusOverview");
  }

  function toggleSection(id: PrintableSectionId) {
    setSelectedSections((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function applyPreset(preset: PrintablePreset) {
    setSelectedSections(presetSections(preset));
  }

  const sectionConfigs = getSectionConfigs({
    data,
    t,
    reportTitle,
    focusLabel,
    selectedSections,
    sectionLabel,
    sectionDescription,
  });

  const orderedSelectedSections = sectionConfigs.filter((section) =>
    selectedSections.includes(section.id),
  );
  const pages = buildPrintablePages(orderedSelectedSections);

  return (
    <section className="flex flex-col gap-6" id="print-builder">
      <Card className="report-screen-only border border-(--color-border)">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                <FiPrinter />
                {t("print.badge")}
              </div>

              <h2 className="mt-4 text-2xl font-extrabold">
                {t("print.title")}
              </h2>
              <p className="mt-2 text-(--color-text-2)">
                {t("print.description")}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                fit
                disabled={pages.length === 0}
                onClick={() => window.print()}
                type="primary"
              >
                <span className="inline-flex items-center gap-2">
                  <FiPrinter />
                  {t("print.actions.print")}
                </span>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <label
              className="flex flex-col gap-2 text-sm"
              htmlFor="print-report-title"
            >
              <span className="text-(--color-text-2)">
                {t("print.titleField")}
              </span>
              <Input
                id="report-title-input"
                value={reportTitle}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setReportTitle(event.target.value)
                }
              />
            </label>

            <div className="flex flex-wrap items-end gap-2">
              <Button
                fit
                onClick={() => setReportTitle(defaultTitle)}
                type="default"
              >
                <span className="inline-flex items-center gap-2">
                  <FiRotateCcw />
                  {t("print.actions.resetTitle")}
                </span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button fit onClick={() => applyPreset("executive")} type="default">
              {t("print.presets.executive")}
            </Button>
            <Button fit onClick={() => applyPreset("finance")} type="default">
              {t("print.presets.finance")}
            </Button>
            <Button
              fit
              onClick={() => applyPreset("operations")}
              type="default"
            >
              {t("print.presets.operations")}
            </Button>
            <Button fit onClick={() => applyPreset("complete")} type="default">
              {t("print.presets.complete")}
            </Button>
            <Button fit onClick={() => setSelectedSections([])} type="default">
              {t("print.actions.clearSelection")}
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {sectionConfigs.map((section) => {
              const selected = selectedSections.includes(section.id);

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className={`rounded-2xl border p-4 text-left transition hover:border-sky-300 hover:bg-sky-50/40 ${selected ? "border-sky-300 bg-sky-50/60" : "border-(--color-border) bg-(--color-base-2)"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{section.label}</p>
                      <p className="mt-1 text-sm text-(--color-text-2)">
                        {section.description}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${sectionBadgeClass(selected)}`}
                    >
                      {selected ? t("print.selected") : t("print.notSelected")}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="report-screen-only flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-(--color-border) bg-(--color-base-2) px-4 py-3">
        <div className="flex flex-wrap items-center gap-4 text-sm text-(--color-text-2)">
          <span className="inline-flex items-center gap-2">
            <FiCheckSquare />
            {t("print.meta.selectedSections", {
              count: orderedSelectedSections.length,
            })}
          </span>
          <span className="inline-flex items-center gap-2">
            <FiLayers />
            {t("print.meta.pages", { count: pages.length })}
          </span>
          <span className="inline-flex items-center gap-2">
            <FiSliders />
            {t("print.meta.rules")}
          </span>
        </div>
      </div>

      {pages.length === 0 ? (
        <Card className="report-screen-only border border-(--color-border)">
          <p className="text-(--color-text-2)">{t("print.empty")}</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {pages.map((pageSections, pageIndex) => {
            const isCoverPage =
              pageSections.length === 1 && pageSections[0]?.id === "cover";

            return (
              <article
                key={`${pageIndex + 1}-${pageSections.map((section) => section.id).join("-")}`}
                className="report-print-page border border-slate-200 bg-white"
              >
                {isCoverPage ? null : (
                  <header className="mb-6 flex items-start justify-between gap-6 border-b border-slate-200 pb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {data.orgName}
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-slate-900">
                        {reportTitle || defaultTitle}
                      </h2>
                      <p className="mt-2 text-sm text-slate-600">
                        {t("generatedAt", {
                          period: data.periodLabel,
                          generatedAt: data.generatedAtLabel,
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {focusLabel()}
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-700">
                        {t("print.meta.pageNumber", {
                          page: pageIndex + 1,
                          total: pages.length,
                        })}
                      </p>
                    </div>
                  </header>
                )}

                <div className="flex flex-col gap-4">
                  {pageSections.map((section) => (
                    <div key={section.id}>{section.render()}</div>
                  ))}
                </div>

                {isCoverPage ? null : (
                  <footer className="report-print-page-footer mt-6 border-t border-slate-200 pt-4 text-xs text-slate-500">
                    <div className="flex items-center justify-between gap-3">
                      <span>{data.orgName}</span>
                      <span>
                        {t("print.meta.pageNumber", {
                          page: pageIndex + 1,
                          total: pages.length,
                        })}
                      </span>
                    </div>
                  </footer>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
