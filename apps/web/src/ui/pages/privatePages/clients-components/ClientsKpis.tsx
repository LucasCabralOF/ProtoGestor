"use client";

import { useTranslations } from "next-intl";
import {
  FiRepeat,
  FiTrendingUp,
  FiUserCheck,
  FiUserPlus,
  FiUsers,
  FiUserX,
} from "react-icons/fi";
import type { ClientsKpis as ClientsKpisType } from "@/lib/clients";
import { Card } from "@/ui/base/Card";

type ClientsKpisProps = {
  kpis: ClientsKpisType;
};

export function ClientsKpis({ kpis }: ClientsKpisProps) {
  const t = useTranslations("clients");

  const activePercent =
    kpis.total > 0 ? Math.round((kpis.active / kpis.total) * 100) : 0;
  const inactivePercent =
    kpis.total > 0 ? Math.round((kpis.inactive / kpis.total) * 100) : 0;
  const recurringPercent =
    kpis.active > 0 ? Math.round((kpis.recurring / kpis.active) * 100) : 0;

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {/* Novos nesta semana */}
      <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-(--color-text-2)">
            {t("kpis.newClients")}
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <FiUserPlus className="h-4.5 w-4.5" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-black tracking-tight">
          {kpis.newThisWeek}
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
          <FiTrendingUp className="h-3.5 w-3.5" />
          <span>{t("kpis.newThisWeek", { value: kpis.newThisWeek })}</span>
        </div>
      </Card>

      {/* Clientes Ativos */}
      <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-(--color-text-2)">
            {t("kpis.activeClients")}
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <FiUsers className="h-4.5 w-4.5" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-black tracking-tight">{kpis.active}</p>
        <p className="mt-2 text-xs font-medium text-(--color-text-2)">
          {activePercent}% {t("kpis.percentOfTotal", { value: activePercent })}
        </p>
      </Card>

      {/* Clientes Inativos */}
      <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-(--color-text-2)">
            {t("kpis.inactiveClients")}
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <FiUserX className="h-4.5 w-4.5" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-black tracking-tight">
          {kpis.inactive}
        </p>
        <p className="mt-2 text-xs font-medium text-(--color-text-2)">
          {inactivePercent}%{" "}
          {t("kpis.percentOfTotal", { value: inactivePercent })}
        </p>
      </Card>

      {/* Total Cadastrado */}
      <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-(--color-text-2)">
            {t("kpis.totalClients")}
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <FiUserCheck className="h-4.5 w-4.5" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-black tracking-tight">{kpis.total}</p>
        <p className="mt-2 text-xs font-medium text-(--color-text-2)">
          {t("kpis.registered")}
        </p>
      </Card>

      {/* Clientes Recorrentes */}
      <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-(--color-text-2)">
            {t("kpis.recurringClients")}
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20">
            <FiRepeat className="h-4.5 w-4.5" />
          </div>
        </div>
        <p className="mt-2 text-3xl font-black tracking-tight">
          {kpis.recurring}
        </p>
        <p className="mt-2 text-xs font-medium text-(--color-text-2)">
          {recurringPercent}%{" "}
          {t("kpis.percentOfActive", { value: recurringPercent })}
        </p>
      </Card>
    </section>
  );
}
