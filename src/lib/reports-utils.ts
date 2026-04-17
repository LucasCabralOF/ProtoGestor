import type { AppLocale } from "@/utils/i18n";
import type { ReportsRangePreset, ReportsFocus, ReportsTrend, ReportsServiceStatusRow } from "./reports-types";

export const BUSINESS_TIME_ZONE = "America/Sao_Paulo";

export function normalizeRange(
  range: ReportsRangePreset | undefined,
): ReportsRangePreset {
  if (range === "90d" || range === "365d") return range;
  return "30d";
}

export function normalizeFocus(focus: ReportsFocus | undefined): ReportsFocus {
  if (focus === "finance" || focus === "operations") return focus;
  return "overview";
}

export function rangeDays(range: ReportsRangePreset): number {
  switch (range) {
    case "90d":
      return 90;
    case "365d":
      return 365;
    case "30d":
    default:
      return 30;
  }
}

export function formatCurrency(cents: number, locale: AppLocale): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function formatInteger(value: number, locale: AppLocale): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatPercent(value: number, locale: AppLocale): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value / 100);
}

export function formatDateTime(value: Date, locale: AppLocale): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: BUSINESS_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export function formatDate(value: Date, locale: AppLocale): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: BUSINESS_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

export function formatMonth(value: Date, locale: AppLocale): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: BUSINESS_TIME_ZONE,
    month: "short",
    year: "numeric",
  }).format(value);
}

export function buildTrend(
  currentValue: number,
  previousValue: number,
  formatter: (value: number) => string,
): ReportsTrend {
  const deltaPct =
    previousValue === 0
      ? currentValue === 0
        ? 0
        : 100
      : Math.round(((currentValue - previousValue) / previousValue) * 100);

  return {
    currentLabel: formatter(currentValue),
    previousLabel: formatter(previousValue),
    deltaPct,
    direction:
      currentValue > previousValue
        ? "up"
        : currentValue < previousValue
          ? "down"
          : "flat",
  };
}

export function serviceStatusMeta(
  key: ReportsServiceStatusRow["key"],
  locale: AppLocale,
): Pick<ReportsServiceStatusRow, "label" | "tone"> {
  switch (key) {
    case "draft":
      return {
        label: locale === "en" ? "Draft" : "Rascunho",
        tone: "neutral",
      };
    case "scheduled":
      return {
        label: locale === "en" ? "Scheduled" : "Agendado",
        tone: "accent",
      };
    case "in_progress":
      return {
        label: locale === "en" ? "In progress" : "Em andamento",
        tone: "warning",
      };
    case "completed":
      return {
        label: locale === "en" ? "Completed" : "Concluído",
        tone: "success",
      };
    case "canceled":
      return {
        label: locale === "en" ? "Canceled" : "Cancelado",
        tone: "danger",
      };
    default:
      return {
        label: "-",
        tone: "neutral",
      };
  }
}
