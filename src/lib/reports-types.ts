export type ReportsRangePreset = "30d" | "90d" | "365d";
export type ReportsFocus = "overview" | "finance" | "operations";

export type ReportsFilters = {
  focus?: ReportsFocus;
  range?: ReportsRangePreset;
};

export type ReportsTrend = {
  currentLabel: string;
  deltaPct: number;
  direction: "down" | "flat" | "up";
  previousLabel: string;
};

export type ReportsMonthlyPoint = {
  balanceCents: number;
  balanceLabel: string;
  expenseCents: number;
  expenseLabel: string;
  expenseWidthPct: number;
  incomeCents: number;
  incomeLabel: string;
  incomeWidthPct: number;
  label: string;
};

export type ReportsCategoryRow = {
  amountCents: number;
  amountLabel: string;
  count: number;
  name: string;
  sharePct: number;
  shareLabel: string;
};

export type ReportsCustomerRow = {
  id: string;
  lastServiceLabel: string;
  name: string;
  revenueCents: number;
  revenueLabel: string;
  servicesCount: number;
};

export type ReportsServiceStatusRow = {
  count: number;
  key: "canceled" | "completed" | "draft" | "in_progress" | "scheduled";
  label: string;
  tone: "accent" | "danger" | "neutral" | "success" | "warning";
};

export type ReportsAppointmentRow = {
  customerName: string | null;
  id: string;
  locationText: string | null;
  startsAtLabel: string;
  title: string;
};

export type ReportsPendingTransactionRow = {
  amountLabel: string;
  contactName: string | null;
  description: string;
  dueAtLabel: string;
  id: string;
  typeLabel: string;
};

export type ReportsAttentionItem = {
  description: string;
  id: string;
  title: string;
  tone: "accent" | "danger" | "success" | "warning";
};

export type ReportsData = {
  attentionItems: ReportsAttentionItem[];
  categories: {
    expense: ReportsCategoryRow[];
    income: ReportsCategoryRow[];
  };
  filters: {
    focus: ReportsFocus;
    range: ReportsRangePreset;
  };
  generatedAtLabel: string;
  kpis: {
    activeCustomers: number;
    avgTicketLabel: string;
    completionRateLabel: string;
    netResultLabel: string;
    newCustomers: number;
    paidExpensesLabel: string;
    receivedRevenueLabel: string;
    scheduledLoadLabel: string;
  };
  monthlySeries: ReportsMonthlyPoint[];
  orgName: string;
  overdueTransactions: ReportsPendingTransactionRow[];
  periodLabel: string;
  serviceStatus: ReportsServiceStatusRow[];
  topCustomers: ReportsCustomerRow[];
  trends: {
    customers: ReportsTrend;
    expenses: ReportsTrend;
    net: ReportsTrend;
    revenue: ReportsTrend;
  };
  upcomingAppointments: ReportsAppointmentRow[];
};

export type ReportsExportRow = {
  metric: string;
  section: string;
  value: string;
};
