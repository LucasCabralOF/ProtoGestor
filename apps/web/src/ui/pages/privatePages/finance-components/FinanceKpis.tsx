"use client";

import {
  FiAlertCircle,
  FiArrowDownRight,
  FiArrowUpRight,
  FiCheckCircle,
  FiPieChart,
} from "react-icons/fi";
import type { FinanceKpisData } from "@/lib/finance-utils";
import { Card } from "@/ui/base/Card";

type FinanceKpisProps = {
  kpis: FinanceKpisData;
};

export function FinanceKpis({ kpis }: FinanceKpisProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {/* Recebido */}
      <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-(--color-text-2)">
            Recebido
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <FiCheckCircle className="h-4.5 w-4.5" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-black tracking-tight text-emerald-500">
          {kpis.totalIncomePaidFormatted}
        </p>
        <p className="mt-1 text-xs font-medium text-(--color-text-2)">
          Entradas confirmadas
        </p>
      </Card>

      {/* A Receber Pendente */}
      <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-(--color-text-2)">
            A Receber
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <FiArrowUpRight className="h-4.5 w-4.5" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-black tracking-tight text-emerald-700 dark:text-emerald-400">
          {kpis.totalIncomePendingFormatted}
        </p>
        <p className="mt-1 text-xs font-medium text-(--color-text-2)">
          Cobranças em aberto
        </p>
      </Card>

      {/* Atrasado / Vencido */}
      <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-(--color-text-2)">
            Atrasado
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <FiAlertCircle className="h-4.5 w-4.5" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-black tracking-tight text-rose-500">
          {kpis.totalIncomeOverdueFormatted}
        </p>
        <p className="mt-1 text-xs font-medium text-(--color-text-2)">
          Necessita cobrança
        </p>
      </Card>

      {/* Despesas Pagas */}
      <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-(--color-text-2)">
            Despesas
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <FiArrowDownRight className="h-4.5 w-4.5" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-black tracking-tight text-amber-500">
          {kpis.totalExpensePaidFormatted}
        </p>
        <p className="mt-1 text-xs font-medium text-(--color-text-2)">
          Saídas pagas
        </p>
      </Card>

      {/* Saldo Líquido */}
      <Card className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-(--color-text-2)">
            Saldo Líquido
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <FiPieChart className="h-4.5 w-4.5" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-black tracking-tight text-purple-500">
          {kpis.netBalanceFormatted}
        </p>
        <p className="mt-1 text-xs font-medium text-(--color-text-2)">
          Entradas - Saídas
        </p>
      </Card>
    </section>
  );
}
