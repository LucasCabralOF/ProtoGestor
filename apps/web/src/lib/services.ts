import "server-only";

import { requireOrgId } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";
import type { AppLocale } from "@/utils/i18n";

const BUSINESS_TIME_ZONE = "America/Sao_Paulo";

export type ServiceStatus =
  | "draft"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "canceled";

type StatusTone = "neutral" | "accent" | "warning" | "success" | "danger";

export type ServicesFilters = {
  customerId?: string;
  q?: string;
  status?: "all" | ServiceStatus;
};

export type ServiceCustomerOption = {
  id: string;
  name: string;
};

export type ServiceRow = {
  id: string;
  title: string;
  description: string | null;
  customerId: string | null;
  customerLabel: string;
  customerName: string | null;
  status: ServiceStatus;
  statusLabel: string;
  statusTone: StatusTone;
  valueCents: number;
  valueInput: string;
  valueLabel: string;
  scheduleLabel: string;
  scheduleMetaLabel: string;
  appointmentDate: string;
  appointmentEndTime: string;
  appointmentId: string | null;
  appointmentStartTime: string;
  locationText: string;
  updatedAtLabel: string;
};

export type ServicesKpis = {
  completed: number;
  inProgress: number;
  scheduled: number;
  total: number;
  upcoming: number;
};

export type ServicesPageData = {
  customerOptions: ServiceCustomerOption[];
  kpis: ServicesKpis;
  rows: ServiceRow[];
};

function normalizeQ(q: string | undefined): string {
  return (q || "").trim();
}

function dateParts(value: Date): Record<string, string> {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: BUSINESS_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(value);

  const out: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      out[part.type] = part.value;
    }
  }
  return out;
}

function formatDateTimeLabel(value: Date | null, locale: AppLocale): string {
  if (!value) return locale === "en" ? "No schedule" : "Sem agendamento";

  return new Intl.DateTimeFormat(locale, {
    timeZone: BUSINESS_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function formatUpdatedAtLabel(value: Date, locale: AppLocale): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: BUSINESS_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

function formatDateInput(value: Date | null): string {
  if (!value) return "";
  const parts = dateParts(value);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function formatTimeInput(value: Date | null): string {
  if (!value) return "";
  const parts = dateParts(value);
  return `${parts.hour}:${parts.minute}`;
}

function formatCurrencyLabel(cents: number, locale: AppLocale): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function formatCurrencyInput(cents: number, locale: AppLocale): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function statusMeta(
  status: ServiceStatus,
  locale: AppLocale,
): {
  label: string;
  tone: StatusTone;
} {
  switch (status) {
    case "draft":
      return { label: locale === "en" ? "Draft" : "Rascunho", tone: "neutral" };
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
  }
}

export async function getServicesPageData(
  filters: ServicesFilters,
  locale: AppLocale = "pt-BR",
): Promise<ServicesPageData> {
  const { orgId } = await requireOrgId();

  const q = normalizeQ(filters.q);
  const status = filters.status || "all";
  const customerId = filters.customerId?.trim() || "";

  const whereStatus = status === "all" ? {} : { status };
  const whereCustomer = customerId.length === 0 ? {} : { customerId };
  const whereQ =
    q.length === 0
      ? {}
      : {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
            {
              customer: {
                is: {
                  name: { contains: q, mode: "insensitive" as const },
                },
              },
            },
          ],
        };

  const baseWhere = {
    orgId,
    ...whereStatus,
    ...whereCustomer,
    ...whereQ,
  };

  const now = new Date();

  const [
    total,
    scheduled,
    inProgress,
    completed,
    upcoming,
    orders,
    customerOptions,
  ] = await Promise.all([
    prisma.serviceOrder.count({ where: { orgId } }),
    prisma.serviceOrder.count({ where: { orgId, status: "scheduled" } }),
    prisma.serviceOrder.count({ where: { orgId, status: "in_progress" } }),
    prisma.serviceOrder.count({ where: { orgId, status: "completed" } }),
    prisma.appointment.count({
      where: {
        orgId,
        status: "scheduled",
        startsAt: { gte: now },
      },
    }),
    prisma.serviceOrder.findMany({
      where: baseWhere,
      orderBy: [{ updatedAt: "desc" }],
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        appointments: {
          orderBy: [{ startsAt: "desc" }],
          take: 1,
          select: {
            id: true,
            startsAt: true,
            endsAt: true,
            locationText: true,
            status: true,
          },
        },
      },
      take: 200,
    }),
    prisma.contact.findMany({
      where: {
        orgId,
        isActive: true,
        roles: {
          some: {
            orgId,
            role: "customer",
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: [{ name: "asc" }],
      take: 500,
    }),
  ]);

  const rows: ServiceRow[] = orders.map((order) => {
    const appointment = order.appointments[0] ?? null;
    const statusInfo = statusMeta(order.status as ServiceStatus, locale);
    const appointmentStatusLabel =
      appointment?.status === "done"
        ? locale === "en"
          ? "Visit completed"
          : "Visita concluída"
        : appointment?.status === "canceled"
          ? locale === "en"
            ? "Visit canceled"
            : "Visita cancelada"
          : appointment
            ? locale === "en"
              ? "Next visit"
              : "Próxima visita"
            : locale === "en"
              ? "Optional scheduling"
              : "Agendamento opcional";

    return {
      id: order.id,
      title: order.title,
      description: order.description ?? null,
      customerId: order.customer?.id ?? null,
      customerLabel:
        order.customer?.name ??
        (locale === "en" ? "No linked client" : "Sem cliente vinculado"),
      customerName: order.customer?.name ?? null,
      status: order.status as ServiceStatus,
      statusLabel: statusInfo.label,
      statusTone: statusInfo.tone,
      valueCents: order.valueCents,
      valueInput: formatCurrencyInput(order.valueCents, locale),
      valueLabel: formatCurrencyLabel(order.valueCents, locale),
      scheduleLabel: formatDateTimeLabel(appointment?.startsAt ?? null, locale),
      scheduleMetaLabel: appointment
        ? `${appointmentStatusLabel}${appointment.locationText ? ` • ${appointment.locationText}` : ""}`
        : appointmentStatusLabel,
      appointmentDate: formatDateInput(appointment?.startsAt ?? null),
      appointmentEndTime: formatTimeInput(appointment?.endsAt ?? null),
      appointmentId: appointment?.id ?? null,
      appointmentStartTime: formatTimeInput(appointment?.startsAt ?? null),
      locationText: appointment?.locationText ?? "",
      updatedAtLabel: formatUpdatedAtLabel(order.updatedAt, locale),
    };
  });

  return {
    customerOptions,
    kpis: {
      total,
      scheduled,
      inProgress,
      completed,
      upcoming,
    },
    rows,
  };
}
