import type { ReportsData, ReportsTrend } from "@/lib/reports";
import type {
  PrintablePreset,
  PrintableSectionConfig,
  PrintableSectionId,
} from "./types";

export const PRINT_PAGE_CAPACITY = 10;

export function defaultPrintableSections(
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

export function presetSections(preset: PrintablePreset): PrintableSectionId[] {
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

export function buildPrintablePages(sections: PrintableSectionConfig[]) {
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

export function trendToneClass(direction: ReportsTrend["direction"]) {
  if (direction === "up") return "text-emerald-700";
  if (direction === "down") return "text-rose-700";
  return "text-slate-500";
}

export function sectionBadgeClass(selected: boolean) {
  if (selected) {
    return "border-sky-300 bg-sky-50 text-sky-700";
  }

  return "border-slate-200 bg-white text-slate-500";
}
