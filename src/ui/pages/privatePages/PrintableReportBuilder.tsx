"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  FiCheckSquare,
  FiFileText,
  FiLayers,
  FiPrinter,
  FiRotateCcw,
  FiSliders,
} from "react-icons/fi";
import type { ReportsData, ReportsTrend } from "@/lib/reports";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { Input } from "@/ui/base/Input";
import {
  CategoriesChart,
  MonthlySeriesChart,
  ServiceStatusChart,
  TopCustomersChart,
} from "@/ui/pages/privatePages/PrintableReportCharts";

type PrintableSectionId =
  | "attention"
  | "categories"
  | "cover"
  | "monthlySeries"
  | "overdue"
  | "serviceStatus"
  | "summary"
  | "topCustomers"
  | "trends"
  | "upcomingAppointments";

type PrintablePreset = "complete" | "executive" | "finance" | "operations";

type PrintableSectionConfig = {
  description: string;
  forceOwnPage?: boolean;
  id: PrintableSectionId;
  label: string;
  render: () => ReactNode;
  units: number;
};

const PRINT_PAGE_CAPACITY = 10;

function defaultPrintableSections(
  focus: ReportsData["filters"]["focus"],
): PrintableSectionId[] {
  if (focus === "finance") {
    return [
      "cover",
      "summary",
      "trends",
      "monthlySeries",
      "categories",
      "overdue",
    ];
  }

  if (focus === "operations") {
    return [
      "cover",
      "summary",
      "attention",
      "serviceStatus",
      "upcomingAppointments",
      "topCustomers",
    ];
  }

  return [
    "cover",
    "summary",
    "trends",
    "attention",
    "monthlySeries",
    "categories",
    "serviceStatus",
    "upcomingAppointments",
    "topCustomers",
    "overdue",
  ];
}

function presetSections(preset: PrintablePreset): PrintableSectionId[] {
  switch (preset) {
    case "executive":
      return ["cover", "summary", "trends", "attention"];
    case "finance":
      return [
        "cover",
        "summary",
        "trends",
        "monthlySeries",
        "categories",
        "overdue",
      ];
    case "operations":
      return [
        "cover",
        "summary",
        "attention",
        "serviceStatus",
        "upcomingAppointments",
        "topCustomers",
      ];
    case "complete":
      return [
        "cover",
        "summary",
        "trends",
        "attention",
        "monthlySeries",
        "categories",
        "serviceStatus",
        "upcomingAppointments",
        "topCustomers",
        "overdue",
      ];
  }
}

function buildPrintablePages(sections: PrintableSectionConfig[]) {
  const pages: PrintableSectionConfig[][] = [];
  let currentPage: PrintableSectionConfig[] = [];
  let currentUnits = 0;

  function flushPage() {
    if (currentPage.length === 0) return;
    pages.push(currentPage);
    currentPage = [];
    currentUnits = 0;
  }

  for (const section of sections) {
    if (section.forceOwnPage) {
      flushPage();
      pages.push([section]);
      continue;
    }

    if (
      currentPage.length > 0 &&
      currentUnits + section.units > PRINT_PAGE_CAPACITY
    ) {
      flushPage();
    }

    currentPage.push(section);
    currentUnits += section.units;
  }

  flushPage();

  return pages;
}

function trendToneClass(direction: ReportsTrend["direction"]) {
  if (direction === "up") return "text-emerald-700";
  if (direction === "down") return "text-rose-700";
  return "text-slate-500";
}

function sectionBadgeClass(selected: boolean) {
  if (selected) {
    return "border-sky-300 bg-sky-50 text-sky-700";
  }

  return "border-slate-200 bg-white text-slate-500";
}

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

  const sectionConfigs: PrintableSectionConfig[] = [
    {
      id: "cover",
      label: sectionLabel("cover"),
      description: sectionDescription("cover"),
      forceOwnPage: true,
      units: 10,
      render: () => (
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
      ),
    },
    {
      id: "summary",
      label: sectionLabel("summary"),
      description: sectionDescription("summary"),
      units: 4,
      render: () => (
        <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-bold text-slate-900">
            {t("print.summary.title")}
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                {t("kpis.receivedRevenue")}
              </p>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {data.kpis.receivedRevenueLabel}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">{t("kpis.paidExpenses")}</p>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {data.kpis.paidExpensesLabel}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">{t("kpis.netResult")}</p>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {data.kpis.netResultLabel}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">{t("kpis.avgTicket")}</p>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {data.kpis.avgTicketLabel}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                {t("kpis.activeCustomers")}
              </p>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {data.kpis.activeCustomers}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                {t("kpis.completionRate")}
              </p>
              <p className="mt-2 text-xl font-bold text-slate-900">
                {data.kpis.completionRateLabel}
              </p>
            </div>
          </div>
        </section>
      ),
    },
    {
      id: "trends",
      label: sectionLabel("trends"),
      description: sectionDescription("trends"),
      units: 4,
      render: () => (
        <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-bold text-slate-900">
            {t("print.trends.title")}
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              {
                id: "revenue",
                label: t("trends.revenue"),
                trend: data.trends.revenue,
              },
              {
                id: "expenses",
                label: t("trends.expenses"),
                trend: data.trends.expenses,
              },
              {
                id: "net",
                label: t("trends.net"),
                trend: data.trends.net,
              },
              {
                id: "customers",
                label: t("trends.customers"),
                trend: data.trends.customers,
              },
            ].map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-medium text-slate-600">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {item.trend.currentLabel}
                </p>
                <p
                  className={`mt-2 text-sm font-semibold ${trendToneClass(item.trend.direction)}`}
                >
                  {item.trend.deltaPct >= 0
                    ? `+${item.trend.deltaPct}`
                    : item.trend.deltaPct}
                  %
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {t("print.trends.previous")}: {item.trend.previousLabel}
                </p>
              </div>
            ))}
          </div>
        </section>
      ),
    },
    {
      id: "attention",
      label: sectionLabel("attention"),
      description: sectionDescription("attention"),
      units: 3,
      render: () => (
        <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-bold text-slate-900">
            {t("attention.title")}
          </h3>
          <div className="mt-4 grid gap-3">
            {data.attentionItems.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                {t("attention.empty")}
              </p>
            ) : (
              data.attentionItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      ),
    },
    {
      id: "monthlySeries",
      label: sectionLabel("monthlySeries"),
      description: sectionDescription("monthlySeries"),
      units: 7,
      render: () => (
        <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-bold text-slate-900">
            {t("finance.monthlyTitle")}
          </h3>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <MonthlySeriesChart data={data.monthlySeries} />
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">
                    {t("print.monthlyTable.month")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("finance.income")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("finance.expense")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("print.monthlyTable.balance")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.monthlySeries.map((item) => (
                  <tr key={item.label} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {item.label}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {item.incomeLabel}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {item.expenseLabel}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {item.balanceLabel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ),
    },
    {
      id: "categories",
      label: sectionLabel("categories"),
      description: sectionDescription("categories"),
      units: 7,
      render: () => (
        <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-bold text-slate-900">
            {t("print.categories.title")}
          </h3>
          {data.categories.income.length > 0 ||
          data.categories.expense.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <CategoriesChart
                expense={data.categories.expense}
                income={data.categories.income}
              />
            </div>
          ) : null}
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                {t("finance.incomeCategories")}
              </p>
              <div className="mt-3 grid gap-3">
                {data.categories.income.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    {t("finance.emptyCategories")}
                  </p>
                ) : (
                  data.categories.income.map((item) => (
                    <div
                      key={item.name}
                      className="border-t border-slate-200 pt-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-slate-900">
                          {item.name}
                        </p>
                        <p className="font-semibold text-slate-900">
                          {item.amountLabel}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.shareLabel}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                {t("finance.expenseCategories")}
              </p>
              <div className="mt-3 grid gap-3">
                {data.categories.expense.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    {t("finance.emptyCategories")}
                  </p>
                ) : (
                  data.categories.expense.map((item) => (
                    <div
                      key={item.name}
                      className="border-t border-slate-200 pt-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-slate-900">
                          {item.name}
                        </p>
                        <p className="font-semibold text-slate-900">
                          {item.amountLabel}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.shareLabel}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      ),
    },
    {
      id: "serviceStatus",
      label: sectionLabel("serviceStatus"),
      description: sectionDescription("serviceStatus"),
      units: 5,
      render: () => (
        <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-bold text-slate-900">
            {t("operations.statusTitle")}
          </h3>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <ServiceStatusChart data={data.serviceStatus} />
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">
                    {t("print.statusTable.status")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("print.statusTable.count")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.serviceStatus.map((item) => (
                  <tr key={item.key} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {item.label}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ),
    },
    {
      id: "upcomingAppointments",
      label: sectionLabel("upcomingAppointments"),
      description: sectionDescription("upcomingAppointments"),
      units: 4,
      render: () => (
        <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-bold text-slate-900">
            {t("operations.upcomingTitle")}
          </h3>
          <div className="mt-4 grid gap-3">
            {data.upcomingAppointments.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                {t("operations.emptyUpcoming")}
              </p>
            ) : (
              data.upcomingAppointments.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.customerName
                      ? t("operations.customerLine", {
                          customer: item.customerName,
                          startsAt: item.startsAtLabel,
                        })
                      : item.startsAtLabel}
                  </p>
                  {item.locationText ? (
                    <p className="mt-1 text-xs text-slate-500">
                      {item.locationText}
                    </p>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </section>
      ),
    },
    {
      id: "topCustomers",
      label: sectionLabel("topCustomers"),
      description: sectionDescription("topCustomers"),
      units: 6,
      render: () => (
        <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-bold text-slate-900">
            {t("operations.topCustomersTitle")}
          </h3>
          {data.topCustomers.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <TopCustomersChart data={data.topCustomers} />
            </div>
          ) : null}
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            {data.topCustomers.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">
                {t("operations.emptyCustomers")}
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">
                      {t("operations.customer")}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t("operations.services")}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t("operations.revenue")}
                    </th>
                    <th className="px-4 py-3 font-medium">
                      {t("operations.lastService")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.topCustomers.map((item) => (
                    <tr key={item.id} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.servicesCount}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.revenueLabel}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.lastServiceLabel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      ),
    },
    {
      id: "overdue",
      label: sectionLabel("overdue"),
      description: sectionDescription("overdue"),
      units: 4,
      render: () => (
        <section className="report-print-section rounded-[20px] border border-slate-200 bg-white p-6">
          <h3 className="text-xl font-bold text-slate-900">
            {t("finance.overdueTitle")}
          </h3>
          <div className="mt-4 grid gap-3">
            {data.overdueTransactions.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                {t("finance.emptyOverdue")}
              </p>
            ) : (
              data.overdueTransactions.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.description}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {item.contactName
                          ? t("finance.overdueLine", {
                              type: item.typeLabel,
                              contact: item.contactName,
                              dueAt: item.dueAtLabel,
                            })
                          : t("finance.overdueLineNoContact", {
                              type: item.typeLabel,
                              dueAt: item.dueAtLabel,
                            })}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-slate-900">
                      {item.amountLabel}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      ),
    },
  ];

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
                id="print-report-title"
                placeholder={defaultTitle}
                value={reportTitle}
                onChange={(event) => setReportTitle(event.target.value)}
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
