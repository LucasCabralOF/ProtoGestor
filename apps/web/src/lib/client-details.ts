import "server-only";

import { requireOrgId } from "@/lib/auth-tenant";
import type {
  ClientAddressDetail,
  ClientDetailsData,
  ClientServiceOrderSummary,
  ClientTagSummary,
  ClientTransactionSummary,
} from "@/lib/client-details-utils";
import { formatCentsBRL } from "@/lib/finance-utils";
import prisma from "@/lib/prisma";
import type { AppLocale } from "@/utils/i18n";

const BUSINESS_TIME_ZONE = "America/Sao_Paulo";

function formatDateLabel(
  date: Date | null,
  locale: AppLocale = "pt-BR",
): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", {
    timeZone: BUSINESS_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatServiceStatus(
  status: string,
  locale: AppLocale = "pt-BR",
): {
  label: string;
  tone: "neutral" | "accent" | "warning" | "success" | "danger";
} {
  switch (status) {
    case "completed":
      return {
        label: locale === "en" ? "Completed" : "Concluído",
        tone: "success",
      };
    case "in_progress":
      return {
        label: locale === "en" ? "In Progress" : "Em Andamento",
        tone: "warning",
      };
    case "scheduled":
      return {
        label: locale === "en" ? "Scheduled" : "Agendado",
        tone: "accent",
      };
    case "canceled":
      return {
        label: locale === "en" ? "Canceled" : "Cancelado",
        tone: "danger",
      };
    default:
      return { label: locale === "en" ? "Draft" : "Rascunho", tone: "neutral" };
  }
}

export async function getClientDetailsData(
  clientId: string,
  locale: AppLocale = "pt-BR",
): Promise<ClientDetailsData | null> {
  const { orgId } = await requireOrgId();

  const contact = await prisma.contact.findFirst({
    where: {
      id: clientId,
      orgId,
    },
    include: {
      addresses: {
        orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
      },
      tagLinks: {
        include: {
          tag: true,
        },
      },
      serviceOrders: {
        include: {
          appointments: {
            orderBy: { startsAt: "asc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
      },
      transactions: {
        orderBy: [{ dueAt: "desc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!contact) {
    return null;
  }

  const now = new Date();

  // Endereços
  const addresses: ClientAddressDetail[] = contact.addresses.map((addr) => ({
    id: addr.id,
    line1: addr.line1,
    line2: addr.line2,
    city: addr.city,
    state: addr.state,
    postalCode: addr.postalCode,
    isPrimary: addr.isPrimary,
    label: addr.label,
  }));

  const primaryAddress =
    addresses.find((a) => a.isPrimary) || addresses[0] || null;

  // Tags
  const tags: ClientTagSummary[] = contact.tagLinks.map((tl) => ({
    id: tl.tag.id,
    name: tl.tag.name,
    color: tl.tag.colorHex || "#3b82f6",
  }));

  // Ordens de Serviço
  const serviceOrders: ClientServiceOrderSummary[] = contact.serviceOrders.map(
    (so) => {
      const statusMeta = formatServiceStatus(so.status, locale);
      const appointment = so.appointments[0];
      let appointmentSummary: string | null = null;
      if (appointment) {
        appointmentSummary = `${formatDateLabel(appointment.startsAt, locale)} (${appointment.status === "done" ? "Realizada" : "Agendada"})`;
      }

      return {
        id: so.id,
        title: so.title,
        description: so.description,
        status: so.status,
        statusLabel: statusMeta.label,
        statusTone: statusMeta.tone,
        valueCents: so.valueCents,
        valueFormatted: formatCentsBRL(so.valueCents, locale),
        createdAtFormatted: formatDateLabel(so.createdAt, locale),
        appointmentSummary,
      };
    },
  );

  // Transações Financeiras
  const transactions: ClientTransactionSummary[] = contact.transactions.map(
    (tx) => {
      const isOverdue =
        tx.status === "pending" &&
        tx.dueAt !== null &&
        tx.dueAt.getTime() < now.getTime();

      return {
        id: tx.id,
        type: tx.type,
        status: tx.status,
        description:
          tx.description || (tx.type === "income" ? "Receita" : "Despesa"),
        amountCents: tx.amountCents,
        amountFormatted: formatCentsBRL(tx.amountCents, locale),
        dueAtFormatted: formatDateLabel(tx.dueAt, locale),
        paidAtFormatted: formatDateLabel(tx.paidAt, locale),
        isOverdue,
      };
    },
  );

  // Estatísticas
  const totalOrders = serviceOrders.length;
  const completedOrders = serviceOrders.filter(
    (o) => o.status === "completed",
  ).length;
  const inProgressOrders = serviceOrders.filter(
    (o) => o.status === "in_progress" || o.status === "scheduled",
  ).length;

  const totalSpentCents = transactions
    .filter((t) => t.type === "income" && t.status === "paid")
    .reduce((sum, t) => sum + t.amountCents, 0);

  const pendingPaymentCents = transactions
    .filter((t) => t.type === "income" && t.status === "pending")
    .reduce((sum, t) => sum + t.amountCents, 0);

  return {
    id: contact.id,
    name: contact.name,
    legalName: contact.legalName,
    document: contact.document,
    email: contact.email,
    phone: contact.phone,
    whatsapp: contact.whatsapp || contact.phone,
    notes: contact.notes,
    isActive: contact.isActive,
    createdAtFormatted: formatDateLabel(contact.createdAt, locale),
    primaryAddress,
    addresses,
    tags,
    serviceOrders,
    transactions,
    stats: {
      totalOrders,
      completedOrders,
      inProgressOrders,
      totalSpentCents,
      totalSpentFormatted: formatCentsBRL(totalSpentCents, locale),
      pendingPaymentCents,
      pendingPaymentFormatted: formatCentsBRL(pendingPaymentCents, locale),
    },
  };
}
