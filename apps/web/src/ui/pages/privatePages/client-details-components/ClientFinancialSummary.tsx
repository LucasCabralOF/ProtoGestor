"use client";

import Link from "next/link";
import {
  FiAlertCircle,
  FiArrowUpRight,
  FiCheck,
  FiClock,
  FiExternalLink,
} from "react-icons/fi";
import type {
  ClientDetailsStats,
  ClientTransactionSummary,
} from "@/lib/client-details-utils";
import type { OrgRoleKey } from "@/types/base";
import { Card } from "@/ui/base/Card";

type ClientFinancialSummaryProps = {
  clientName: string;
  currentRole?: OrgRoleKey;
  stats: ClientDetailsStats;
  transactions: ClientTransactionSummary[];
};

export function ClientFinancialSummary({
  stats,
  transactions,
  clientName,
  currentRole = "owner",
}: ClientFinancialSummaryProps) {
  // Colaboradores não têm acesso aos números financeiros
  if (currentRole === "member") {
    return null;
  }

  return (
    <Card className="border border-(--color-border) bg-(--color-base-1)">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-(--color-text)">
              Resumo Financeiro & Cobrança
            </h2>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-500 border border-emerald-500/20">
              {transactions.length}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-(--color-text-2)">
            Controle de pagamentos, cobranças pendentes e faturamento acumulado.
          </p>
        </div>

        <Link
          href={`/finance?q=${encodeURIComponent(clientName)}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500 hover:underline"
        >
          <span>Abrir no Financeiro</span>
          <FiExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Cards de Métricas do Cliente */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Total Faturado & Pago
            </span>
            <FiCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-1 text-2xl font-black text-emerald-600">
            {stats.totalSpentFormatted}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Pendente de Pagamento
            </span>
            <FiClock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-400">
            {stats.pendingPaymentFormatted}
          </p>
        </div>
      </div>

      {/* Lista de Movimentações Recentes */}
      {transactions.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-(--color-text-2) mb-2">
            Últimas Cobranças
          </p>
          <div className="flex flex-col gap-2">
            {transactions.slice(0, 5).map((tx) => {
              const isPaid = tx.status === "paid";
              const isOverdue = tx.isOverdue;

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-lg border border-(--color-border) bg-(--color-base-2) p-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-md ${
                        isPaid
                          ? "bg-emerald-500/10 text-emerald-500"
                          : isOverdue
                            ? "bg-rose-500/10 text-rose-500"
                            : "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                      }`}
                    >
                      {isPaid ? (
                        <FiCheck className="h-3.5 w-3.5" />
                      ) : isOverdue ? (
                        <FiAlertCircle className="h-3.5 w-3.5" />
                      ) : (
                        <FiArrowUpRight className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-(--color-text)">
                        {tx.description}
                      </p>
                      <p className="text-[11px] text-(--color-text-2)">
                        {isPaid && tx.paidAtFormatted
                          ? `Pago em ${tx.paidAtFormatted}`
                          : `Vencimento: ${tx.dueAtFormatted}`}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`font-bold ${
                      isPaid
                        ? "text-emerald-500"
                        : isOverdue
                          ? "text-rose-500"
                          : "text-teal-700 dark:text-teal-400"
                    }`}
                  >
                    {tx.amountFormatted}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
