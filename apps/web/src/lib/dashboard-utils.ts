import type { ReturnAlertItem } from "@/lib/recurrence-utils";

export type DashboardKpiStats = {
  activeClients: number;
  monthlyRevenueDeltaPct: number;
  monthlyRevenueLabel: string;
  newClientsThisMonth: number;
  pendingIssues: number;
  servicesCompletedThisWeek: number;
  servicesThisWeek: number;
};

export type DashboardActivityItem = {
  createdAtLabel: string;
  id: string;
  message: string;
};

export type DashboardUpcomingService = {
  customerName: string | null;
  id: string;
  startsAtLabel: string;
  title: string;
};

export type DashboardData = {
  kpis: DashboardKpiStats;
  orgName: string;
  recentActivity: DashboardActivityItem[];
  returnAlerts: ReturnAlertItem[];
  upcomingServices: DashboardUpcomingService[];
};
