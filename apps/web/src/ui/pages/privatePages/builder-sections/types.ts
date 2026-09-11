import type { ReactNode } from "react";

export type PrintableSectionId =
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

export type PrintablePreset =
  | "complete"
  | "executive"
  | "finance"
  | "operations";

export type PrintableSectionConfig = {
  description: string;
  forceOwnPage?: boolean;
  id: PrintableSectionId;
  label: string;
  render: () => ReactNode;
  units: number;
};
