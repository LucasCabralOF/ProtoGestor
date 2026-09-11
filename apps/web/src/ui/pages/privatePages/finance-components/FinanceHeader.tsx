"use client";

import { FiDollarSign, FiPlus } from "react-icons/fi";
import { Button } from "@/ui/base/Button";

type FinanceHeaderProps = {
  onNewTransaction: () => void;
};

export function FinanceHeader({ onNewTransaction }: FinanceHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
            <FiDollarSign className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-(--color-text)">
            Financeiro
          </h1>
        </div>
        <p className="mt-1 text-sm text-(--color-text-2)">
          Acompanhe contas a receber, pagamentos e fluxo de caixa da empresa.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          fit
          onClick={onNewTransaction}
          testid="finance-new-transaction"
          type="primary"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm transition-all"
        >
          <span className="flex items-center gap-1.5">
            <FiPlus className="h-4 w-4" />
            <span>Nova Movimentação</span>
          </span>
        </Button>
      </div>
    </div>
  );
}
