"use client";

import Link from "next/link";
import {
  FiCalendar,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiPlus,
} from "react-icons/fi";
import type { ClientServiceOrderSummary } from "@/lib/client-details-utils";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";

type ClientServiceHistoryProps = {
  clientId: string;
  serviceOrders: ClientServiceOrderSummary[];
};

export function ClientServiceHistory({
  serviceOrders,
  clientId,
}: ClientServiceHistoryProps) {
  return (
    <Card className="border border-(--color-border) bg-(--color-base-1)">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-(--color-text)">
              Histórico Operacional de Atendimentos
            </h2>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              {serviceOrders.length}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-(--color-text-2)">
            Todas as ordens de serviço e visitas realizadas para este cliente.
          </p>
        </div>

        <Link href={`/services?customerId=${clientId}`}>
          <Button fit type="default">
            <span className="inline-flex items-center gap-1 text-xs">
              <FiPlus className="h-3.5 w-3.5" />
              <span>Nova OS</span>
            </span>
          </Button>
        </Link>
      </div>

      {serviceOrders.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-(--color-border) bg-(--color-base-2)/50 py-10 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <FiClipboard className="h-5 w-5" />
          </div>
          <p className="mt-2 text-sm font-semibold text-(--color-text)">
            Nenhum atendimento registrado
          </p>
          <p className="mt-0.5 text-xs text-(--color-text-2)">
            Crie uma ordem de serviço para iniciar o histórico deste cliente.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {serviceOrders.map((so) => {
            const isCompleted = so.status === "completed";

            return (
              <div
                key={so.id}
                className="flex flex-col gap-2.5 rounded-xl border border-(--color-border) bg-(--color-base-2) p-4 transition-all hover:bg-(--color-base-3)/50 sm:flex-row sm:items-center sm:justify-between"
                data-testid={`client-so-${so.id}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                      isCompleted
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    }`}
                  >
                    {isCompleted ? (
                      <FiCheckCircle className="h-4 w-4" />
                    ) : (
                      <FiClock className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-sm text-(--color-text)">
                        {so.title}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                          so.statusTone === "success"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : so.statusTone === "warning"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : so.statusTone === "accent"
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                                : so.statusTone === "danger"
                                  ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                  : "bg-zinc-500/10 text-zinc-600 border-zinc-500/20"
                        }`}
                      >
                        {so.statusLabel}
                      </span>
                    </div>

                    {so.description && (
                      <p className="mt-0.5 text-xs text-(--color-text-2) line-clamp-1">
                        {so.description}
                      </p>
                    )}

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-(--color-text-2)">
                      <span>Criada em: {so.createdAtFormatted}</span>
                      {so.appointmentSummary && (
                        <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                          <FiCalendar className="h-3 w-3" />
                          Visita: {so.appointmentSummary}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right sm:self-center">
                  <span className="text-sm font-black text-emerald-500">
                    {so.valueFormatted}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
