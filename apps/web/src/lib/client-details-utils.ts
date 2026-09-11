import type { AddressInput } from "@/lib/whatsapp-utils";

export type ClientServiceOrderSummary = {
  appointmentSummary: string | null;
  createdAtFormatted: string;
  description: string | null;
  id: string;
  status: string;
  statusLabel: string;
  statusTone: "neutral" | "accent" | "warning" | "success" | "danger";
  title: string;
  valueCents: number;
  valueFormatted: string;
};

export type ClientTransactionSummary = {
  amountCents: number;
  amountFormatted: string;
  description: string;
  dueAtFormatted: string;
  id: string;
  isOverdue: boolean;
  paidAtFormatted: string | null;
  status: "pending" | "paid" | "canceled";
  type: "income" | "expense";
};

export type ClientTagSummary = {
  color: string;
  id: string;
  name: string;
};

export type ClientAddressDetail = AddressInput & {
  id: string;
  isPrimary: boolean;
  label: string | null;
};

export type ClientDetailsStats = {
  completedOrders: number;
  inProgressOrders: number;
  pendingPaymentCents: number;
  pendingPaymentFormatted: string;
  totalOrders: number;
  totalSpentCents: number;
  totalSpentFormatted: string;
};

export type ClientDetailsData = {
  addresses: ClientAddressDetail[];
  createdAtFormatted: string;
  document: string | null;
  email: string | null;
  id: string;
  isActive: boolean;
  legalName: string | null;
  name: string;
  notes: string | null;
  phone: string | null;
  primaryAddress: ClientAddressDetail | null;
  serviceOrders: ClientServiceOrderSummary[];
  stats: ClientDetailsStats;
  tags: ClientTagSummary[];
  transactions: ClientTransactionSummary[];
  whatsapp: string | null;
};
