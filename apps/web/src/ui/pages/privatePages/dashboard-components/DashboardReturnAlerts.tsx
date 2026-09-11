"use client";

import Link from "next/link";
import {
  FiAlertTriangle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMessageCircle,
  FiPlus,
  FiRepeat,
} from "react-icons/fi";
import {
  buildWhatsAppReturnReminderMessage,
  type ReturnAlertItem,
} from "@/lib/recurrence-utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp-utils";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";

type DashboardReturnAlertsProps = {
  alerts: ReturnAlertItem[];
  onScheduleReturn?: (alert: ReturnAlertItem) => void;
  orgName?: string;
};

export function DashboardReturnAlerts({
  alerts,
  onScheduleReturn,
  orgName = "Nossa Empresa",
}: DashboardReturnAlertsProps) {
  const overdueCount = alerts.filter((a) => a.isOverdue).length;

  return (
    <Card className="border border-(--color-border) bg-(--color-base-1)">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <FiRepeat className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-(--color-text)">
                Retornos e Recorrências do Mês
              </h2>
              {alerts.length > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold border ${
                    overdueCount > 0
                      ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                  }`}
                  data-testid="badge-return-alerts-count"
                >
                  {alerts.length} {alerts.length === 1 ? "cliente" : "clientes"}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-(--color-text-2)">
              Clientes com ciclos periódicos que necessitam de novo agendamento.
            </p>
          </div>
        </div>

        <Link href="/schedule">
          <Button fit type="default">
            <span className="inline-flex items-center gap-1.5 text-xs">
              <FiCalendar className="h-3.5 w-3.5" />
              <span>Ver Agenda</span>
            </span>
          </Button>
        </Link>
      </div>

      <div className="mt-4">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-(--color-border) bg-(--color-base-2)/40 py-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <FiCheckCircle className="h-5 w-5" />
            </div>
            <p className="mt-2 text-sm font-semibold text-(--color-text)">
              Todos os ciclos em dia!
            </p>
            <p className="mt-0.5 text-xs text-(--color-text-2)">
              Nenhum cliente recorrente com visita pendente de agendamento neste
              mês.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {alerts.map((alert) => {
              const waMessage = buildWhatsAppReturnReminderMessage({
                customerName: alert.customerName,
                orgName,
                serviceTitle: alert.serviceTitle,
                recurrenceRuleLabel: alert.recurrenceRuleLabel,
              });

              const whatsappUrl = alert.customerPhone
                ? buildWhatsAppUrl(alert.customerPhone, waMessage)
                : null;

              return (
                <div
                  key={alert.id}
                  className="flex flex-col gap-3 rounded-xl border border-(--color-border) bg-(--color-base-2) p-3.5 transition-all hover:bg-(--color-base-3)/60 sm:flex-row sm:items-center sm:justify-between"
                  data-testid={`return-alert-card-${alert.customerId}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                        alert.isOverdue
                          ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {alert.isOverdue ? (
                        <FiAlertTriangle className="h-4 w-4" />
                      ) : (
                        <FiClock className="h-4 w-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/clients/${alert.customerId}`}
                          className="font-semibold text-sm text-(--color-text) hover:text-(--color-primary) hover:underline"
                        >
                          {alert.customerName}
                        </Link>

                        <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          {alert.recurrenceRuleLabel}
                        </span>

                        <span
                          className={`rounded-md px-2 py-0.5 text-[11px] font-bold border ${
                            alert.isOverdue
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }`}
                        >
                          {alert.isOverdue
                            ? `Atrasado (venceu ${alert.dueReturnDateLabel})`
                            : `Retorno em ${alert.dueReturnDateLabel}`}
                        </span>
                      </div>

                      <p className="mt-0.5 text-xs text-(--color-text-2)">
                        Serviço: <strong>{alert.serviceTitle}</strong> • Último
                        atendimento em {alert.lastCompletedAtLabel}
                      </p>
                    </div>
                  </div>

                  {/* Ações de Campo */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:bg-emerald-500/20"
                        data-testid={`whatsapp-alert-${alert.customerId}`}
                      >
                        <FiMessageCircle className="h-3.5 w-3.5" />
                        <span>Lembrete WhatsApp</span>
                      </a>
                    )}

                    {onScheduleReturn ? (
                      <button
                        type="button"
                        onClick={() => onScheduleReturn(alert)}
                        className="inline-flex items-center gap-1 rounded-lg bg-(--color-primary) px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:brightness-110 hover:shadow-sm"
                        data-testid={`schedule-alert-${alert.customerId}`}
                      >
                        <FiPlus className="h-3.5 w-3.5" />
                        <span>Agendar Retorno</span>
                      </button>
                    ) : (
                      <Link
                        href={`/schedule?customerId=${alert.customerId}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-(--color-primary) px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:brightness-110 hover:shadow-sm"
                        data-testid={`schedule-alert-${alert.customerId}`}
                      >
                        <FiPlus className="h-3.5 w-3.5" />
                        <span>Agendar Retorno</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
