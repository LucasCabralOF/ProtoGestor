import type { ReactNode } from "react";
import type { useTranslations } from "next-intl";
import type { ReportsData } from "@/lib/reports";
import type { PrintableSectionConfig, PrintableSectionId } from "./types";
import { SectionCover } from "./SectionCover";
import {
  SectionSummary,
  SectionTrends,
  SectionMonthlySeries,
  SectionCategories,
  SectionOverdue,
} from "./SectionFinance";
import {
  SectionAttention,
  SectionServiceStatus,
  SectionUpcoming,
  SectionTopCustomers,
} from "./SectionOperations";

export function getSectionConfigs({
  data,
  t,
  reportTitle,
  focusLabel,
  selectedSections,
  sectionLabel,
  sectionDescription,
}: {
  data: ReportsData;
  t: ReturnType<typeof useTranslations>;
  reportTitle: string;
  focusLabel: () => string;
  selectedSections: string[];
  sectionLabel: (id: PrintableSectionId) => string;
  sectionDescription: (id: PrintableSectionId) => string;
}): PrintableSectionConfig[] {
  return [
    {
      id: "cover",
      label: sectionLabel("cover"),
      description: sectionDescription("cover"),
      forceOwnPage: true,
      units: 10,
      render: () => (
        <SectionCover
          data={data}
          t={t}
          reportTitle={reportTitle}
          focusLabel={focusLabel}
          selectedSections={selectedSections}
          sectionLabel={sectionLabel}
        />
      ),
    },
    {
      id: "summary",
      label: sectionLabel("summary"),
      description: sectionDescription("summary"),
      units: 4,
      render: () => <SectionSummary data={data} t={t} />,
    },
    {
      id: "trends",
      label: sectionLabel("trends"),
      description: sectionDescription("trends"),
      units: 4,
      render: () => <SectionTrends data={data} t={t} />,
    },
    {
      id: "attention",
      label: sectionLabel("attention"),
      description: sectionDescription("attention"),
      units: 3,
      render: () => <SectionAttention data={data} t={t} />,
    },
    {
      id: "monthlySeries",
      label: sectionLabel("monthlySeries"),
      description: sectionDescription("monthlySeries"),
      units: 7,
      render: () => <SectionMonthlySeries data={data} t={t} />,
    },
    {
      id: "categories",
      label: sectionLabel("categories"),
      description: sectionDescription("categories"),
      units: 7,
      render: () => <SectionCategories data={data} t={t} />,
    },
    {
      id: "serviceStatus",
      label: sectionLabel("serviceStatus"),
      description: sectionDescription("serviceStatus"),
      units: 5,
      render: () => <SectionServiceStatus data={data} t={t} />,
    },
    {
      id: "upcomingAppointments",
      label: sectionLabel("upcomingAppointments"),
      description: sectionDescription("upcomingAppointments"),
      units: 4,
      render: () => <SectionUpcoming data={data} t={t} />,
    },
    {
      id: "topCustomers",
      label: sectionLabel("topCustomers"),
      description: sectionDescription("topCustomers"),
      units: 6,
      render: () => <SectionTopCustomers data={data} t={t} />,
    },
    {
      id: "overdue",
      label: sectionLabel("overdue"),
      description: sectionDescription("overdue"),
      units: 4,
      render: () => <SectionOverdue data={data} t={t} />,
    },
  ];
}
