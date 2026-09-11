"use client";

import {
  FiAlertCircle,
  FiArrowDownRight,
  FiArrowUpRight,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiX,
} from "react-icons/fi";
import type { TransactionRow } from "@/lib/finance-utils";
import { Button } from "@/ui/base/Button";

type FinanceTableProps = {
  loadingId: string | null;
  onCancel: (id: string) => void;
  onMarkPaid: (id: string) => void;
  rows: TransactionRow[];
};

export function FinanceTable({
  rows,
  onMarkPaid,
  onCancel,
  loadingId,
}: FinanceTableProps) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-(--color-border) bg-(--color-base-1) py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <FiCheckCircle className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-(--color-text)">
          Nenhuma movimentação encontrada
        </h3>
        <p className="mt-1 text-sm text-(--color-text-2) max-w-sm">
          Não foram encontradas receitas ou despesas com os filtros
          selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-(--color-border) bg-(--color-base-1) shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-(--color-text)">
          <thead className="border-b border-(--color-border) bg-(--color-base-2) text-xs font-semibold uppercase tracking-wider text-(--color-text-2)">
            <tr>
              <th scope="col" className="px-4 py-3.5">
                Descrição & Origem
              </th>
              <th scope="col" className="px-4 py-3.5">
                Categoria / Conta
              </th>
              <th scope="col" className="px-4 py-3.5">
                Vencimento
              </th>
              <th scope="col" className="px-4 py-3.5">
                Status
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Valor
              </th>
              <th scope="col" className="px-4 py-3.5 text-center">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border)">
            {rows.map((row) => {
              const isIncome = row.type === "income";
              const isPaid = row.status === "paid";
              const isCanceled = row.status === "canceled";
              const isOverdue = row.isOverdue;
              const isLoading = loadingId === row.id;

              return (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-(--color-base-2)/50"
                  data-testid={`finance-row-${row.id}`}
                >
                  {/* Descrição & Origem */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                          isIncome
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        }`}
                      >
                        {isIncome ? (
                          <FiArrowUpRight className="h-4 w-4" />
                        ) : (
                          <FiArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-(--color-text)">
                          {row.description}
                        </p>
                        {row.contactName && (
                          <p className="text-xs text-(--color-text-2)">
                            Cliente: {row.contactName}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Categoria / Conta */}
                  <td className="px-4 py-3.5">
                    <div className="text-xs">
                      <p className="font-medium text-(--color-text)">
                        {row.categoryName || "Geral"}
                      </p>
                      <p className="text-(--color-text-2)">
                        {row.accountName || "Conta Padrão"}
                      </p>
                    </div>
                  </td>

                  {/* Vencimento */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="text-xs">
                      <p
                        className={`font-medium ${
                          isOverdue
                            ? "text-rose-500 font-semibold"
                            : "text-(--color-text)"
                        }`}
                      >
                        {row.dueAtFormatted}
                      </p>
                      {isPaid && row.paidAtFormatted && (
                        <p className="text-(--color-text-2)">
                          Pago em: {row.paidAtFormatted}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                        <FiCheck className="h-3 w-3" />
                        Pago
                      </span>
                    ) : isCanceled ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-500/10 px-2.5 py-1 text-xs font-medium text-zinc-500 border border-zinc-500/20">
                        <FiX className="h-3 w-3" />
                        Cancelado
                      </span>
                    ) : isOverdue ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 border border-rose-500/20 animate-pulse">
                        <FiAlertCircle className="h-3 w-3" />
                        Vencido
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        <FiClock className="h-3 w-3" />
                        Pendente
                      </span>
                    )}
                  </td>

                  {/* Valor */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <span
                      className={`font-bold ${
                        isIncome ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {isIncome ? "+" : "-"} {row.amountFormatted}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {!isPaid && !isCanceled && (
                        <>
                          <Button
                            fit
                            loading={isLoading}
                            onClick={() => onMarkPaid(row.id)}
                            testid={`mark-paid-${row.id}`}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2.5 py-1 rounded-lg transition-all"
                          >
                            <span className="flex items-center gap-1">
                              <FiCheck className="h-3.5 w-3.5" />
                              <span>Baixar</span>
                            </span>
                          </Button>
                          <Button
                            fit
                            onClick={() => onCancel(row.id)}
                            testid={`cancel-${row.id}`}
                            className="text-zinc-500 hover:text-rose-500 text-xs px-2 py-1 transition-all"
                          >
                            <FiX className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                      {isPaid && (
                        <span className="text-xs text-emerald-500 font-medium">
                          Concluído
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
