import "server-only";

import prisma from "@/lib/prisma";
import type { AppLocale } from "@/utils/i18n";
import {
  formatDateLabel,
  formatTimeLabel,
} from "@/lib/schedule-utils";

// Re-export puras para que qualquer consumer server-side possa importar de um só lugar
export {
  buildRecurrenceDates,
  centsToCurrencyLabel,
  formatDateLabel,
  formatTimeLabel,
} from "@/lib/schedule-utils";

// ---------------------------------------------------------------------------
// Tipos públicos exportados para a página
// ---------------------------------------------------------------------------

export type AppointmentPeriod = "today" | "week" | "month" | "all";
export type AppointmentStatusFilter = "all" | "scheduled" | "done" | "canceled";

export type ScheduleFilters = {
  period: AppointmentPeriod;
  status: AppointmentStatusFilter;
  customerId: string;
  q: string;
};

export type AppointmentRow = {
  id: string;
  status: "scheduled" | "done" | "canceled";
  statusLabel: string;
  statusTone: "default" | "success" | "danger" | "warning";

  startsAt: Date;
  endsAt: Date;
  dateLabel: string;
  timeLabel: string;

  locationText: string | null;
  notes: string | null;

  customerId: string | null;
  customerName: string | null;
  customerLabel: string;

  serviceOrderId: string | null;
  serviceOrderTitle: string | null;

  recurrenceRule: "none" | "weekly" | "biweekly" | "monthly";
  recurrenceCount: number;
  parentId: string | null;
  isRecurrenceRoot: boolean;
};

export type ScheduleKpis = {
  total: number;
  scheduled: number;
  done: number;
  canceled: number;
  today: number;
};

export type SchedulePageData = {
  rows: AppointmentRow[];
  kpis: ScheduleKpis;
  customerOptions: { id: string; name: string }[];
};

// Helpers puros delegados para schedule-utils.ts (testável sem server-only)

// ---------------------------------------------------------------------------
// Helpers internos de status
// ---------------------------------------------------------------------------

function resolveStatusLabel(
  status: "scheduled" | "done" | "canceled",
  locale: AppLocale,
): string {
  const labels: Record<typeof status, Record<AppLocale, string>> = {
    scheduled: { "pt-BR": "Agendado", en: "Scheduled" },
    done: { "pt-BR": "Concluído", en: "Done" },
    canceled: { "pt-BR": "Cancelado", en: "Canceled" },
  };
  return labels[status][locale];
}

function statusTone(
  status: "scheduled" | "done" | "canceled",
): AppointmentRow["statusTone"] {
  if (status === "done") return "success";
  if (status === "canceled") return "danger";
  return "warning";
}

// ---------------------------------------------------------------------------
// Filtros de período
// ---------------------------------------------------------------------------

function buildPeriodFilter(
  period: AppointmentPeriod,
): { startsAt?: { gte: Date; lte?: Date } } {
  const now = new Date();

  if (period === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { startsAt: { gte: start, lte: end } };
  }

  if (period === "week") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    return { startsAt: { gte: start, lte: end } };
  }

  if (period === "month") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    return { startsAt: { gte: start, lte: end } };
  }

  return {}; // "all" — sem filtro de data
}

// ---------------------------------------------------------------------------
// Query principal
// ---------------------------------------------------------------------------

export async function getSchedulePageData(
  orgId: string,
  locale: AppLocale,
  filters: ScheduleFilters,
): Promise<SchedulePageData> {
  const periodFilter = buildPeriodFilter(filters.period);

  // Filtro de texto: match em locationText, notes ou nome do cliente
  const qTrimmed = filters.q.trim();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [appointments, kpiRows, customerOptions, todayCount] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        orgId,
        ...(filters.status !== "all" ? { status: filters.status } : {}),
        ...periodFilter,
        ...(filters.customerId
          ? { serviceOrder: { customerId: filters.customerId } }
          : {}),
        ...(qTrimmed
          ? {
              OR: [
                { locationText: { contains: qTrimmed, mode: "insensitive" } },
                { notes: { contains: qTrimmed, mode: "insensitive" } },
                {
                  serviceOrder: {
                    customer: { name: { contains: qTrimmed, mode: "insensitive" } },
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: [{ startsAt: "asc" }],
      include: {
        serviceOrder: {
          select: {
            id: true,
            title: true,
            customerId: true,
            customer: { select: { id: true, name: true } },
          },
        },
      },
    }),

    // KPIs globais da org (sem filtros de período/status para os contadores totais)
    prisma.appointment.groupBy({
      by: ["status"],
      where: { orgId },
      _count: { id: true },
    }),

    // Lista de clientes com pelo menos uma visita — para o select de filtro
    prisma.contact.findMany({
      where: {
        orgId,
        isActive: true,
        roles: { some: { role: "customer" } },
        serviceOrders: { some: { appointments: { some: {} } } },
      },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),

    // Count de hoje da org
    prisma.appointment.count({
      where: { orgId, startsAt: { gte: todayStart, lte: todayEnd } },
    }),
  ]);

  // KPIs
  const countByStatus: Record<string, number> = {};
  for (const g of kpiRows) {
    countByStatus[g.status] = g._count.id;
  }

  const scheduled = countByStatus["scheduled"] ?? 0;
  const done = countByStatus["done"] ?? 0;
  const canceled = countByStatus["canceled"] ?? 0;

  const kpis: ScheduleKpis = {
    total: scheduled + done + canceled,
    scheduled,
    done,
    canceled,
    today: todayCount,
  };

  // Formata rows
  const rows: AppointmentRow[] = appointments.map((a) => {
    const customer = a.serviceOrder?.customer ?? null;
    const customerName = customer?.name ?? null;

    return {
      id: a.id,
      status: a.status,
      statusLabel: resolveStatusLabel(a.status, locale),
      statusTone: statusTone(a.status),

      startsAt: a.startsAt,
      endsAt: a.endsAt,
      dateLabel: formatDateLabel(a.startsAt, locale),
      timeLabel: `${formatTimeLabel(a.startsAt, locale)} – ${formatTimeLabel(a.endsAt, locale)}`,

      locationText: a.locationText,
      notes: a.notes,

      customerId: customer?.id ?? null,
      customerName,
      customerLabel: customerName ?? "—",

      serviceOrderId: a.serviceOrder?.id ?? null,
      serviceOrderTitle: a.serviceOrder?.title ?? null,

      recurrenceRule: a.recurrenceRule as AppointmentRow["recurrenceRule"],
      recurrenceCount: a.recurrenceCount,
      parentId: a.parentId,
      isRecurrenceRoot: a.parentId === null && a.recurrenceRule !== "none",
    };
  });

  return { rows, kpis, customerOptions };
}
