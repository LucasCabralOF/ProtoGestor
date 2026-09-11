"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ChangeEvent, useTransition } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import type { FinanceFilters as FinanceFiltersType } from "@/lib/finance-utils";

type FinanceFiltersProps = {
  currentFilters: FinanceFiltersType;
};

export function FinanceFilters({ currentFilters }: FinanceFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateParam("q", e.target.value);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-(--color-border) bg-(--color-base-1) p-4 shadow-xs md:flex-row md:items-center md:justify-between">
      {/* Busca textual */}
      <div className="relative flex-1">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-2) h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar por descrição, cliente, categoria ou conta..."
          defaultValue={currentFilters.q ?? ""}
          onChange={handleSearchChange}
          className="w-full rounded-lg border border-(--color-border) bg-(--color-base-2) py-2 pl-9 pr-4 text-sm text-(--color-text) placeholder:text-(--color-text-2) focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          data-testid="finance-search-input"
        />
      </div>

      {/* Filtros em linha */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-(--color-text-2) mr-1">
          <FiFilter className="h-3.5 w-3.5" />
          <span>Filtros:</span>
        </div>

        {/* Período */}
        <select
          value={currentFilters.period ?? "this_month"}
          onChange={(e) => updateParam("period", e.target.value)}
          className="rounded-lg border border-(--color-border) bg-(--color-base-2) px-3 py-2 text-xs font-medium text-(--color-text) focus:border-emerald-500 focus:outline-hidden"
          data-testid="finance-filter-period"
        >
          <option value="this_month">Este Mês</option>
          <option value="last_month">Mês Passado</option>
          <option value="all">Todo o Histórico</option>
        </select>

        {/* Tipo */}
        <select
          value={currentFilters.type ?? "all"}
          onChange={(e) => updateParam("type", e.target.value)}
          className="rounded-lg border border-(--color-border) bg-(--color-base-2) px-3 py-2 text-xs font-medium text-(--color-text) focus:border-emerald-500 focus:outline-hidden"
          data-testid="finance-filter-type"
        >
          <option value="all">Todas as Movimentações</option>
          <option value="income">Apenas Receitas (+)</option>
          <option value="expense">Apenas Despesas (-)</option>
        </select>

        {/* Status */}
        <select
          value={currentFilters.status ?? "all"}
          onChange={(e) => updateParam("status", e.target.value)}
          className="rounded-lg border border-(--color-border) bg-(--color-base-2) px-3 py-2 text-xs font-medium text-(--color-text) focus:border-emerald-500 focus:outline-hidden"
          data-testid="finance-filter-status"
        >
          <option value="all">Todos os Status</option>
          <option value="overdue">Atrasados / Vencidos</option>
          <option value="pending">Pendentes</option>
          <option value="paid">Pagos</option>
          <option value="canceled">Cancelados</option>
        </select>

        {isPending && (
          <span className="text-xs text-(--color-text-2) animate-pulse">
            Atualizando...
          </span>
        )}
      </div>
    </div>
  );
}
