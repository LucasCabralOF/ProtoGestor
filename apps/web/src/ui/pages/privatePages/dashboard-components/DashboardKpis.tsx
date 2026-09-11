"use client";

import { useTranslations } from "next-intl";
import {
  FiActivity,
  FiArrowUpRight,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import type { DashboardData } from "@/lib/dashboard-utils";
import { Card } from "@/ui/base/Card";

type DashboardKpisProps = {
  isMember: boolean;
  kpis: DashboardData["kpis"];
};

export function DashboardKpis({ kpis, isMember }: DashboardKpisProps) {
  const t = useTranslations("dashboard");

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {/* Card 1: Receita Mensal (Owner/Admin) vs Serviços Concluídos (Member) */}
      {!isMember ? (
        <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-(--color-text-2)">
                {t("monthlyRevenue")}
              </p>
              <p className="mt-2 text-3xl font-black tracking-tight">
                {kpis.monthlyRevenueLabel}
              </p>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-500">
                <FiArrowUpRight className="text-xs" />
                {t("vsLastMonth", {
                  prefix: kpis.monthlyRevenueDeltaPct >= 0 ? "+" : "",
                  value: kpis.monthlyRevenueDeltaPct,
                })}
              </div>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
              <FiDollarSign className="text-xl" />
            </div>
          </div>
        </Card>
      ) : (
        <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-(--color-text-2)">
                Concluídos na Semana
              </p>
              <p className="mt-2 text-3xl font-black tracking-tight text-emerald-500">
                {kpis.servicesCompletedThisWeek}
              </p>
              <p className="mt-2 text-xs font-medium text-(--color-text-2)">
                Atendimentos finalizados
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
              <FiActivity className="text-xl" />
            </div>
          </div>
        </Card>
      )}

      {/* Clientes ativos */}
      <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-(--color-text-2)">
              {t("activeClients")}
            </p>
            <p className="mt-2 text-3xl font-black tracking-tight">
              {kpis.activeClients}
            </p>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-500">
              {t("newClientsThisMonth", { value: kpis.newClientsThisMonth })}
            </div>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-500">
            <FiUsers className="text-xl" />
          </div>
        </div>
      </Card>

      {/* Serviços da semana */}
      <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-(--color-text-2)">
              {t("servicesThisWeek")}
            </p>
            <p className="mt-2 text-3xl font-black tracking-tight">
              {kpis.servicesThisWeek}
            </p>
            <p className="mt-2 text-xs font-medium text-(--color-text-2)">
              {t("servicesWeekSummary", {
                completed: kpis.servicesCompletedThisWeek,
                pending: Math.max(
                  0,
                  kpis.servicesThisWeek - kpis.servicesCompletedThisWeek,
                ),
              })}
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-500">
            <FiCalendar className="text-xl" />
          </div>
        </div>
      </Card>

      {/* Card 4: Taxa de Crescimento (Owner/Admin) vs Pendências Operacionais (Member) */}
      {!isMember ? (
        <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-(--color-text-2)">
                {t("growthRate")}
              </p>
              <p className="mt-2 text-3xl font-black tracking-tight">
                {kpis.monthlyRevenueDeltaPct}%
              </p>
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-xs font-bold text-violet-500">
                <FiArrowUpRight className="text-xs" />
                {t("vsLastMonth", {
                  prefix: kpis.monthlyRevenueDeltaPct >= 0 ? "+" : "",
                  value: kpis.monthlyRevenueDeltaPct,
                })}
              </div>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-500">
              <FiTrendingUp className="text-xl" />
            </div>
          </div>
        </Card>
      ) : (
        <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-(--color-text-2)">
                Pendências em Aberto
              </p>
              <p className="mt-2 text-3xl font-black tracking-tight text-amber-500">
                {kpis.pendingIssues}
              </p>
              <p className="mt-2 text-xs font-medium text-(--color-text-2)">
                Atendimentos a iniciar
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-500">
              <FiClock className="text-xl" />
            </div>
          </div>
        </Card>
      )}
    </section>
  );
}
