import "server-only";

import { requireOrgId } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";
import type { AppLocale } from "@/utils/i18n";

const BUSINESS_TIME_ZONE = "America/Sao_Paulo";

export type ProjectStage =
  | "scoping"
  | "planned"
  | "execution"
  | "delivery"
  | "archived";

export type ProjectsFilters = {
  q?: string;
  stage?: "all" | ProjectStage;
};

type StatusTone = "neutral" | "accent" | "warning" | "success" | "danger";
type ServiceStatus =
  | "draft"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "canceled";

export type ProjectLane = {
  count: number;
  description: string;
  label: string;
  stage: ProjectStage;
};

export type ProjectRow = {
  customerHref: string | null;
  customerName: string | null;
  description: string | null;
  detailHref: string;
  id: string;
  nextStepLabel: string;
  ownerLabel: string;
  progressPct: number;
  scheduleLabel: string;
  stage: ProjectStage;
  stageLabel: string;
  statusLabel: string;
  statusTone: StatusTone;
  title: string;
  updatedAtLabel: string;
  valueLabel: string;
};

export type ProjectsPageData = {
  attentionItems: {
    description: string;
    href: string;
    hrefLabel: string;
    id: string;
    title: string;
  }[];
  kpis: {
    active: number;
    completed: number;
    customerCount: number;
    projectedRevenueLabel: string;
    total: number;
    upcomingVisits: number;
  };
  lanes: ProjectLane[];
  recentActivity: {
    createdAtLabel: string;
    id: string;
    message: string;
  }[];
  rows: ProjectRow[];
};

function normalizeQ(q: string | undefined): string {
  return (q || "").trim();
}

function formatCurrencyLabel(cents: number, locale: AppLocale): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function formatDateLabel(value: Date, locale: AppLocale): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: BUSINESS_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

function formatDateTimeLabel(value: Date | null, locale: AppLocale): string {
  if (!value)
    return locale === "en" ? "No milestone scheduled" : "Sem marco agendado";

  return new Intl.DateTimeFormat(locale, {
    timeZone: BUSINESS_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function mapStatus(
  status: ServiceStatus,
  locale: AppLocale,
): {
  progressPct: number;
  stage: ProjectStage;
  stageLabel: string;
  statusLabel: string;
  statusTone: StatusTone;
} {
  switch (status) {
    case "draft":
      return {
        progressPct: 15,
        stage: "scoping",
        stageLabel: locale === "en" ? "Scoping" : "Escopo",
        statusLabel: locale === "en" ? "Open briefing" : "Briefing em aberto",
        statusTone: "neutral",
      };
    case "scheduled":
      return {
        progressPct: 45,
        stage: "planned",
        stageLabel: locale === "en" ? "Planning" : "Planejamento",
        statusLabel: locale === "en" ? "Planned" : "Planejado",
        statusTone: "accent",
      };
    case "in_progress":
      return {
        progressPct: 75,
        stage: "execution",
        stageLabel: locale === "en" ? "Execution" : "Execução",
        statusLabel: locale === "en" ? "In execution" : "Em execução",
        statusTone: "warning",
      };
    case "completed":
      return {
        progressPct: 100,
        stage: "delivery",
        stageLabel: locale === "en" ? "Delivery" : "Entrega",
        statusLabel: locale === "en" ? "Completed" : "Concluído",
        statusTone: "success",
      };
    case "canceled":
      return {
        progressPct: 0,
        stage: "archived",
        stageLabel: locale === "en" ? "Archived" : "Arquivo",
        statusLabel: locale === "en" ? "Canceled" : "Cancelado",
        statusTone: "danger",
      };
  }
}

function stageToStatuses(stage: "all" | ProjectStage): ServiceStatus[] | null {
  switch (stage) {
    case "scoping":
      return ["draft"];
    case "planned":
      return ["scheduled"];
    case "execution":
      return ["in_progress"];
    case "delivery":
      return ["completed"];
    case "archived":
      return ["canceled"];
    case "all":
      return null;
  }
}

function laneDescription(stage: ProjectStage, locale: AppLocale): string {
  switch (stage) {
    case "scoping":
      return locale === "en"
        ? "Project in discovery, briefing, and initial definition."
        : "Projeto em descoberta, briefing e definição inicial.";
    case "planned":
      return locale === "en"
        ? "Approved scope, dates, and owners organized."
        : "Escopo aprovado, datas e responsáveis organizados.";
    case "execution":
      return locale === "en"
        ? "Field or production work with active follow-up."
        : "Atividade em campo ou em produção com acompanhamento ativo.";
    case "delivery":
      return locale === "en"
        ? "Delivery completed and ready for final follow-up."
        : "Entrega concluída e pronta para acompanhamento final.";
    case "archived":
      return locale === "en"
        ? "Flows paused, canceled, or kept only for history."
        : "Fluxos pausados, cancelados ou mantidos apenas para histórico.";
  }
}

function nextStepLabel(params: {
  hasCustomer: boolean;
  hasOwner: boolean;
  locale: AppLocale;
  scheduleLabel: string;
  status: ServiceStatus;
}): string {
  if (!params.hasCustomer) {
    return params.locale === "en"
      ? "Link a client before the next stage"
      : "Vincular cliente antes da próxima etapa";
  }

  if (params.status === "draft") {
    return params.locale === "en"
      ? "Define scope, value, and move to planning"
      : "Definir escopo, valor e mover para planejamento";
  }

  if (
    params.status === "scheduled" &&
    params.scheduleLabel ===
      (params.locale === "en" ? "No milestone scheduled" : "Sem marco agendado")
  ) {
    return params.locale === "en"
      ? "Schedule a visit, kickoff, or checkpoint"
      : "Agendar visita, kickoff ou checkpoint";
  }

  if (
    !params.hasOwner &&
    params.status !== "completed" &&
    params.status !== "canceled"
  ) {
    return params.locale === "en"
      ? "Assign a primary owner"
      : "Designar responsável principal";
  }

  if (params.status === "in_progress") {
    return params.locale === "en"
      ? "Track execution and prepare delivery"
      : "Acompanhar execução e preparar entrega";
  }

  if (params.status === "completed") {
    return params.locale === "en"
      ? "Register follow-up and future opportunities"
      : "Registrar follow-up e oportunidades futuras";
  }

  if (params.status === "canceled") {
    return params.locale === "en"
      ? "Keep history and review resumption if needed"
      : "Manter histórico e revisar retomada se necessário";
  }

  return params.locale === "en"
    ? "Validate upcoming milestones with the team"
    : "Validar próximos marcos com a equipe";
}

export async function getProjectsPageData(
  filters: ProjectsFilters,
  locale: AppLocale = "pt-BR",
): Promise<ProjectsPageData> {
  const { orgId } = await requireOrgId();

  const q = normalizeQ(filters.q);
  const stage = filters.stage || "all";
  const statuses = stageToStatuses(stage);
  const now = new Date();

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

  const filteredWhere = {
    orgId,
    ...whereQ,
    ...(statuses ? { status: { in: statuses } } : {}),
  };

  const [
    total,
    active,
    completed,
    projectedRevenue,
    upcomingVisits,
    customerIds,
    laneCounts,
    orders,
    recentActivity,
  ] = await Promise.all([
    prisma.serviceOrder.count({ where: { orgId } }),
    prisma.serviceOrder.count({
      where: { orgId, status: { in: ["scheduled", "in_progress"] } },
    }),
    prisma.serviceOrder.count({ where: { orgId, status: "completed" } }),
    prisma.serviceOrder.aggregate({
      where: {
        orgId,
        status: { in: ["draft", "scheduled", "in_progress", "completed"] },
      },
      _sum: { valueCents: true },
    }),
    prisma.appointment.count({
      where: { orgId, status: "scheduled", startsAt: { gte: now } },
    }),
    prisma.serviceOrder.findMany({
      where: { orgId, customerId: { not: null } },
      distinct: ["customerId"],
      select: { customerId: true },
    }),
    prisma.serviceOrder.groupBy({
      by: ["status"],
      where: { orgId },
      _count: { _all: true },
    }),
    prisma.serviceOrder.findMany({
      where: filteredWhere,
      orderBy: [{ updatedAt: "desc" }],
      take: 24,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        updatedAt: true,
        valueCents: true,
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        appointments: {
          orderBy: [{ startsAt: "asc" }],
          select: {
            startsAt: true,
            status: true,
            locationText: true,
            employee: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.activityLog.findMany({
      where: { orgId },
      orderBy: [{ createdAt: "desc" }],
      take: 6,
      select: {
        id: true,
        message: true,
        createdAt: true,
      },
    }),
  ]);

  const laneCountMap = new Map<ServiceStatus, number>();
  for (const lane of laneCounts) {
    laneCountMap.set(lane.status as ServiceStatus, lane._count._all);
  }

  const lanes: ProjectLane[] = [
    {
      stage: "scoping",
      label: locale === "en" ? "Scoping" : "Escopo",
      count: laneCountMap.get("draft") ?? 0,
      description: laneDescription("scoping", locale),
    },
    {
      stage: "planned",
      label: locale === "en" ? "Planning" : "Planejamento",
      count: laneCountMap.get("scheduled") ?? 0,
      description: laneDescription("planned", locale),
    },
    {
      stage: "execution",
      label: locale === "en" ? "Execution" : "Execução",
      count: laneCountMap.get("in_progress") ?? 0,
      description: laneDescription("execution", locale),
    },
    {
      stage: "delivery",
      label: locale === "en" ? "Delivery" : "Entrega",
      count: laneCountMap.get("completed") ?? 0,
      description: laneDescription("delivery", locale),
    },
    {
      stage: "archived",
      label: locale === "en" ? "Archived" : "Arquivo",
      count: laneCountMap.get("canceled") ?? 0,
      description: laneDescription("archived", locale),
    },
  ];

  const rows: ProjectRow[] = orders.map((order) => {
    const latestScheduledAppointment =
      order.appointments.find(
        (appointment) => appointment.status === "scheduled",
      ) ?? null;
    const latestRelevantAppointment =
      latestScheduledAppointment ?? order.appointments[0] ?? null;
    const statusMeta = mapStatus(order.status as ServiceStatus, locale);
    const ownerName = latestRelevantAppointment?.employee?.name?.trim() || "";
    const scheduleLabel = formatDateTimeLabel(
      latestRelevantAppointment?.startsAt ?? null,
      locale,
    );

    return {
      customerHref: order.customer?.name
        ? `/clients?q=${encodeURIComponent(order.customer.name)}`
        : null,
      customerName: order.customer?.name ?? null,
      description: order.description ?? null,
      detailHref: `/services?q=${encodeURIComponent(order.title)}`,
      id: order.id,
      nextStepLabel: nextStepLabel({
        hasCustomer: !!order.customer?.id,
        hasOwner: ownerName.length > 0,
        locale,
        scheduleLabel,
        status: order.status as ServiceStatus,
      }),
      ownerLabel:
        ownerName ||
        (locale === "en" ? "Owner to define" : "Responsável a definir"),
      progressPct: statusMeta.progressPct,
      scheduleLabel,
      stage: statusMeta.stage,
      stageLabel: statusMeta.stageLabel,
      statusLabel: statusMeta.statusLabel,
      statusTone: statusMeta.statusTone,
      title: order.title,
      updatedAtLabel: formatDateLabel(order.updatedAt, locale),
      valueLabel: formatCurrencyLabel(order.valueCents, locale),
    };
  });

  const attentionItems = rows
    .filter(
      (row) =>
        row.nextStepLabel !==
          (locale === "en"
            ? "Register follow-up and future opportunities"
            : "Registrar follow-up e oportunidades futuras") &&
        row.nextStepLabel !==
          (locale === "en"
            ? "Keep history and review resumption if needed"
            : "Manter histórico e revisar retomada se necessário"),
    )
    .slice(0, 4)
    .map((row) => ({
      id: row.id,
      title: row.title,
      description: row.nextStepLabel,
      href: row.detailHref,
      hrefLabel: locale === "en" ? "Open flow" : "Abrir fluxo",
    }));

  return {
    attentionItems,
    kpis: {
      total,
      active,
      completed,
      customerCount: customerIds.length,
      projectedRevenueLabel: formatCurrencyLabel(
        projectedRevenue._sum.valueCents ?? 0,
        locale,
      ),
      upcomingVisits,
    },
    lanes,
    recentActivity: recentActivity.map((item) => ({
      id: item.id,
      message: item.message,
      createdAtLabel: formatDateLabel(item.createdAt, locale),
    })),
    rows,
  };
}
