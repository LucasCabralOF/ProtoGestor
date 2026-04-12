import "server-only";

import { requireOrgId } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";

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

function formatCurrencyLabel(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

function formatDateLabel(value: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: BUSINESS_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value);
}

function formatDateTimeLabel(value: Date | null): string {
  if (!value) return "Sem marco agendado";

  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: BUSINESS_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function mapStatus(status: ServiceStatus): {
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
        stageLabel: "Escopo",
        statusLabel: "Briefing em aberto",
        statusTone: "neutral",
      };
    case "scheduled":
      return {
        progressPct: 45,
        stage: "planned",
        stageLabel: "Planejamento",
        statusLabel: "Planejado",
        statusTone: "accent",
      };
    case "in_progress":
      return {
        progressPct: 75,
        stage: "execution",
        stageLabel: "Execucao",
        statusLabel: "Em execucao",
        statusTone: "warning",
      };
    case "completed":
      return {
        progressPct: 100,
        stage: "delivery",
        stageLabel: "Entrega",
        statusLabel: "Concluido",
        statusTone: "success",
      };
    case "canceled":
      return {
        progressPct: 0,
        stage: "archived",
        stageLabel: "Arquivo",
        statusLabel: "Cancelado",
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

function laneDescription(stage: ProjectStage): string {
  switch (stage) {
    case "scoping":
      return "Projeto em descoberta, briefing e definicao inicial.";
    case "planned":
      return "Escopo aprovado, datas e responsaveis organizados.";
    case "execution":
      return "Atividade em campo ou em producao com acompanhamento ativo.";
    case "delivery":
      return "Entrega concluida e pronta para acompanhamento final.";
    case "archived":
      return "Fluxos pausados, cancelados ou mantidos apenas para historico.";
  }
}

function nextStepLabel(params: {
  hasCustomer: boolean;
  hasOwner: boolean;
  scheduleLabel: string;
  status: ServiceStatus;
}): string {
  if (!params.hasCustomer) {
    return "Vincular cliente antes da proxima etapa";
  }

  if (params.status === "draft") {
    return "Definir escopo, valor e mover para planejamento";
  }

  if (
    params.status === "scheduled" &&
    params.scheduleLabel === "Sem marco agendado"
  ) {
    return "Agendar visita, kickoff ou checkpoint";
  }

  if (
    !params.hasOwner &&
    params.status !== "completed" &&
    params.status !== "canceled"
  ) {
    return "Designar responsavel principal";
  }

  if (params.status === "in_progress") {
    return "Acompanhar execucao e preparar entrega";
  }

  if (params.status === "completed") {
    return "Registrar follow-up e oportunidades futuras";
  }

  if (params.status === "canceled") {
    return "Manter historico e revisar retomada se necessario";
  }

  return "Validar proximos marcos com a equipe";
}

export async function getProjectsPageData(
  filters: ProjectsFilters,
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
      label: "Escopo",
      count: laneCountMap.get("draft") ?? 0,
      description: laneDescription("scoping"),
    },
    {
      stage: "planned",
      label: "Planejamento",
      count: laneCountMap.get("scheduled") ?? 0,
      description: laneDescription("planned"),
    },
    {
      stage: "execution",
      label: "Execucao",
      count: laneCountMap.get("in_progress") ?? 0,
      description: laneDescription("execution"),
    },
    {
      stage: "delivery",
      label: "Entrega",
      count: laneCountMap.get("completed") ?? 0,
      description: laneDescription("delivery"),
    },
    {
      stage: "archived",
      label: "Arquivo",
      count: laneCountMap.get("canceled") ?? 0,
      description: laneDescription("archived"),
    },
  ];

  const rows: ProjectRow[] = orders.map((order) => {
    const latestScheduledAppointment =
      order.appointments.find(
        (appointment) => appointment.status === "scheduled",
      ) ?? null;
    const latestRelevantAppointment =
      latestScheduledAppointment ?? order.appointments[0] ?? null;
    const statusMeta = mapStatus(order.status as ServiceStatus);
    const ownerName = latestRelevantAppointment?.employee?.name?.trim() || "";
    const scheduleLabel = formatDateTimeLabel(
      latestRelevantAppointment?.startsAt ?? null,
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
        scheduleLabel,
        status: order.status as ServiceStatus,
      }),
      ownerLabel: ownerName || "Responsavel a definir",
      progressPct: statusMeta.progressPct,
      scheduleLabel,
      stage: statusMeta.stage,
      stageLabel: statusMeta.stageLabel,
      statusLabel: statusMeta.statusLabel,
      statusTone: statusMeta.statusTone,
      title: order.title,
      updatedAtLabel: formatDateLabel(order.updatedAt),
      valueLabel: formatCurrencyLabel(order.valueCents),
    };
  });

  const attentionItems = rows
    .filter(
      (row) =>
        row.nextStepLabel !== "Registrar follow-up e oportunidades futuras" &&
        row.nextStepLabel !==
          "Manter historico e revisar retomada se necessario",
    )
    .slice(0, 4)
    .map((row) => ({
      id: row.id,
      title: row.title,
      description: row.nextStepLabel,
      href: row.detailHref,
      hrefLabel: "Abrir fluxo",
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
      ),
      upcomingVisits,
    },
    lanes,
    recentActivity: recentActivity.map((item) => ({
      id: item.id,
      message: item.message,
      createdAtLabel: formatDateLabel(item.createdAt),
    })),
    rows,
  };
}
