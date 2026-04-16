"use client";

import type { EChartsOption } from "echarts/types/dist/shared";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import type {
  ReportsCategoryRow,
  ReportsCustomerRow,
  ReportsMonthlyPoint,
  ReportsServiceStatusRow,
} from "@/lib/reports";
import { EChart } from "@/ui/base/EChart";

function chartTextStyle() {
  return {
    color: "#64748b",
    fontFamily: "var(--font-sans)",
  };
}

function formatCompactCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
}

function buildMonthlySeriesOption(params: {
  balanceLabel: string;
  data: ReportsMonthlyPoint[];
  expenseLabel: string;
  incomeLabel: string;
  locale: string;
}): EChartsOption {
  return {
    animationDuration: 400,
    aria: { enabled: true },
    color: ["#22c55e", "#ef4444", "#1677ff"],
    grid: {
      top: 40,
      right: 10,
      bottom: 10,
      left: 10,
      containLabel: true,
    },
    legend: {
      top: 0,
      textStyle: chartTextStyle(),
    },
    tooltip: {
      trigger: "axis" as const,
    },
    xAxis: {
      type: "category" as const,
      data: params.data.map((item) => item.label),
      axisTick: { show: false },
      axisLine: {
        lineStyle: {
          color: "#cbd5e1",
        },
      },
      axisLabel: chartTextStyle(),
    },
    yAxis: {
      type: "value" as const,
      splitLine: {
        lineStyle: {
          color: "#e2e8f0",
          type: "dashed" as const,
        },
      },
      axisLabel: {
        ...chartTextStyle(),
        formatter: (value: number) =>
          formatCompactCurrency(Number(value), params.locale),
      },
    },
    series: [
      {
        name: params.incomeLabel,
        type: "bar" as const,
        barMaxWidth: 24,
        data: params.data.map((item) => item.incomeCents / 100),
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
        },
      },
      {
        name: params.expenseLabel,
        type: "bar" as const,
        barMaxWidth: 24,
        data: params.data.map((item) => item.expenseCents / 100),
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
        },
      },
      {
        name: params.balanceLabel,
        type: "line" as const,
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        data: params.data.map((item) => item.balanceCents / 100),
      },
    ],
  };
}

function buildCategoriesOption(params: {
  expense: ReportsCategoryRow[];
  expenseLabel: string;
  income: ReportsCategoryRow[];
  incomeLabel: string;
}): EChartsOption {
  return {
    animationDuration: 400,
    aria: { enabled: true },
    color: [
      "#16a34a",
      "#4ade80",
      "#86efac",
      "#bbf7d0",
      "#dcfce7",
      "#dc2626",
      "#fb7185",
      "#fda4af",
      "#fecdd3",
      "#ffe4e6",
    ],
    legend: {
      top: 0,
      textStyle: chartTextStyle(),
    },
    tooltip: {
      trigger: "item" as const,
    },
    series: [
      {
        name: params.incomeLabel,
        type: "pie" as const,
        radius: ["35%", "58%"],
        center: ["25%", "58%"],
        label: {
          color: "#475569",
          formatter: "{b}",
        },
        data: params.income.map((item) => ({
          value: item.amountCents / 100,
          name: item.name,
        })),
      },
      {
        name: params.expenseLabel,
        type: "pie" as const,
        radius: ["35%", "58%"],
        center: ["75%", "58%"],
        label: {
          color: "#475569",
          formatter: "{b}",
        },
        data: params.expense.map((item) => ({
          value: item.amountCents / 100,
          name: item.name,
        })),
      },
    ],
  };
}

function buildServiceStatusOption(
  data: ReportsServiceStatusRow[],
): EChartsOption {
  const toneColorMap: Record<ReportsServiceStatusRow["tone"], string> = {
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
    accent: "#0ea5e9",
    neutral: "#94a3b8",
  };

  return {
    animationDuration: 400,
    aria: { enabled: true },
    grid: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
      containLabel: true,
    },
    tooltip: {
      trigger: "axis" as const,
      axisPointer: {
        type: "shadow" as const,
      },
    },
    xAxis: {
      type: "category" as const,
      data: data.map((item) => item.label),
      axisTick: { show: false },
      axisLine: {
        lineStyle: {
          color: "#cbd5e1",
        },
      },
      axisLabel: chartTextStyle(),
    },
    yAxis: {
      type: "value" as const,
      splitLine: {
        lineStyle: {
          color: "#e2e8f0",
          type: "dashed" as const,
        },
      },
      axisLabel: chartTextStyle(),
    },
    series: [
      {
        type: "bar" as const,
        barMaxWidth: 28,
        data: data.map((item) => ({
          value: item.count,
          itemStyle: {
            color: toneColorMap[item.tone],
            borderRadius: [8, 8, 0, 0],
          },
        })),
      },
    ],
  };
}

function buildTopCustomersOption(params: {
  data: ReportsCustomerRow[];
  locale: string;
}): EChartsOption {
  const rows = [...params.data].reverse();

  return {
    animationDuration: 400,
    aria: { enabled: true },
    grid: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
      containLabel: true,
    },
    tooltip: {
      trigger: "axis" as const,
      axisPointer: {
        type: "shadow" as const,
      },
    },
    xAxis: {
      type: "value" as const,
      splitLine: {
        lineStyle: {
          color: "#e2e8f0",
          type: "dashed" as const,
        },
      },
      axisLabel: {
        ...chartTextStyle(),
        formatter: (value: number) =>
          formatCompactCurrency(Number(value), params.locale),
      },
    },
    yAxis: {
      type: "category" as const,
      data: rows.map((item) => item.name),
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: chartTextStyle(),
    },
    series: [
      {
        type: "bar" as const,
        barMaxWidth: 24,
        data: rows.map((item) => item.revenueCents / 100),
        itemStyle: {
          color: "#1677ff",
          borderRadius: [0, 8, 8, 0],
        },
      },
    ],
  };
}

export function MonthlySeriesChart({ data }: { data: ReportsMonthlyPoint[] }) {
  const t = useTranslations("reports");
  const locale = useLocale();

  const option = useMemo(
    () =>
      buildMonthlySeriesOption({
        data,
        locale,
        incomeLabel: t("finance.income"),
        expenseLabel: t("finance.expense"),
        balanceLabel: t("print.monthlyTable.balance"),
      }),
    [data, locale, t],
  );

  return (
    <EChart
      ariaLabel={t("print.charts.monthlyAriaLabel")}
      className="w-full"
      height={240}
      option={option}
    />
  );
}

export function CategoriesChart({
  expense,
  income,
}: {
  expense: ReportsCategoryRow[];
  income: ReportsCategoryRow[];
}) {
  const t = useTranslations("reports");

  const option = useMemo(
    () =>
      buildCategoriesOption({
        expense,
        income,
        incomeLabel: t("finance.income"),
        expenseLabel: t("finance.expense"),
      }),
    [expense, income, t],
  );

  return (
    <EChart
      ariaLabel={t("print.charts.categoriesAriaLabel")}
      className="w-full"
      height={280}
      option={option}
    />
  );
}

export function ServiceStatusChart({
  data,
}: {
  data: ReportsServiceStatusRow[];
}) {
  const t = useTranslations("reports");
  const option = useMemo(() => buildServiceStatusOption(data), [data]);

  return (
    <EChart
      ariaLabel={t("print.charts.serviceStatusAriaLabel")}
      className="w-full"
      height={220}
      option={option}
    />
  );
}

export function TopCustomersChart({ data }: { data: ReportsCustomerRow[] }) {
  const t = useTranslations("reports");
  const locale = useLocale();

  const option = useMemo(
    () =>
      buildTopCustomersOption({
        data,
        locale,
      }),
    [data, locale],
  );

  return (
    <EChart
      ariaLabel={t("print.charts.topCustomersAriaLabel")}
      className="w-full"
      height={240}
      option={option}
    />
  );
}
