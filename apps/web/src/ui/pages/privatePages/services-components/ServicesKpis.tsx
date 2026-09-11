"use client";

import { useTranslations } from "next-intl";
import {
  FiActivity,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiLayers,
} from "react-icons/fi";
import type { ServicesKpis as ServicesKpisType } from "@/lib/services";
import { Card } from "@/ui/base/Card";

type ServicesKpisProps = {
  kpis: ServicesKpisType;
};

export function ServicesKpis({ kpis }: ServicesKpisProps) {
  const t = useTranslations("services");

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {/* Total de Ordens */}
      <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-(--color-text-2)">
            {t("kpis.total")}
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <FiLayers className="h-4.5 w-4.5" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-black tracking-tight">{kpis.total}</p>
        <p className="mt-2 text-xs font-medium text-(--color-text-2)">
          {t("kpis.totalHint")}
        </p>
      </Card>

      {/* Agendados */}
      <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-(--color-text-2)">
            {t("kpis.scheduled")}
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
            <FiCalendar className="h-4.5 w-4.5" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-black tracking-tight">
          {kpis.scheduled}
        </p>
        <p className="mt-2 text-xs font-medium text-(--color-text-2)">
          {t("kpis.scheduledHint")}
        </p>
      </Card>

      {/* Em Execução */}
      <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-(--color-text-2)">
            {t("kpis.inProgress")}
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <FiActivity className="h-4.5 w-4.5" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-black tracking-tight">
          {kpis.inProgress}
        </p>
        <p className="mt-2 text-xs font-medium text-(--color-text-2)">
          {t("kpis.inProgressHint")}
        </p>
      </Card>

      {/* Concluídos */}
      <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-(--color-text-2)">
            {t("kpis.completed")}
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <FiCheckCircle className="h-4.5 w-4.5" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-black tracking-tight">
          {kpis.completed}
        </p>
        <p className="mt-2 text-xs font-medium text-(--color-text-2)">
          {t("kpis.completedHint")}
        </p>
      </Card>

      {/* Próximos (7 dias) */}
      <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-(--color-text-2)">
            {t("kpis.upcoming")}
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <FiClock className="h-4.5 w-4.5" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-black tracking-tight">
          {kpis.upcoming}
        </p>
        <p className="mt-2 text-xs font-medium text-(--color-text-2)">
          {t("kpis.upcomingHint")}
        </p>
      </Card>
    </section>
  );
}
