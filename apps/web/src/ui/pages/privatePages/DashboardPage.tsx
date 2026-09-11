"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { FiActivity, FiChevronRight, FiClock } from "react-icons/fi";
import type { DashboardData } from "@/lib/dashboard-utils";
import type {
  RecurrenceSuggestion,
  ReturnAlertItem,
} from "@/lib/recurrence-utils";
import type { OrgRoleKey } from "@/types/base";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { DashboardKpis } from "./dashboard-components/DashboardKpis";
import { DashboardReturnAlerts } from "./dashboard-components/DashboardReturnAlerts";
import { OnboardingChecklist } from "./OnboardingChecklist";
import { RecurrenceSuggestionModal } from "./RecurrenceSuggestionModal";

export function DashboardPage({
  userName,
  data,
  hasClients,
  hasServices,
  currentRole = "owner",
}: {
  userName: string;
  data: DashboardData;
  /** Conta tem pelo menos 1 cliente ativo — usado para o checklist de ativação */
  hasClients: boolean;
  /** Conta tem pelo menos 1 ordem de serviço — usado para o checklist de ativação */
  hasServices: boolean;
  currentRole?: OrgRoleKey;
}) {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const isMember = currentRole === "member";

  const [selectedAlert, setSelectedAlert] = useState<ReturnAlertItem | null>(
    null,
  );

  const suggestion = useMemo<RecurrenceSuggestion | null>(() => {
    if (!selectedAlert) return null;
    return {
      serviceOrderId: selectedAlert.serviceOrderId,
      serviceTitle: selectedAlert.serviceTitle,
      customerId: selectedAlert.customerId,
      customerName: selectedAlert.customerName,
      customerPhone: selectedAlert.customerPhone,
      locationText: null,
      recurrenceRule: selectedAlert.recurrenceRule,
      recurrenceRuleLabel: selectedAlert.recurrenceRuleLabel,
      suggestedDate: selectedAlert.suggestedDate,
      suggestedDateLabel: selectedAlert.dueReturnDateLabel,
      suggestedStartTime: selectedAlert.suggestedStartTime,
      suggestedEndTime: selectedAlert.suggestedEndTime,
    };
  }, [selectedAlert]);

  return (
    <div className="flex flex-col gap-6">
      {!isMember && (
        <OnboardingChecklist
          hasClients={hasClients}
          hasServices={hasServices}
        />
      )}

      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          {t("title", { userName })}
        </h1>
        <p className="text-sm text-(--color-text-2)">
          {isMember
            ? "Acompanhe seus atendimentos, visitas agendadas e tarefas da equipe."
            : t("subtitle")}
        </p>
      </header>

      {/* Grid de KPIs Extraído */}
      <DashboardKpis kpis={data.kpis} isMember={isMember} />

      {/* Widget de Retornos e Recorrências do Mês (Fase 4) */}
      <DashboardReturnAlerts
        alerts={data.returnAlerts}
        orgName={data.orgName}
        onScheduleReturn={(alert) => setSelectedAlert(alert)}
      />

      {/* Atividades e Próximos Serviços */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Atividade Recente */}
        <Card className="border border-(--color-border) bg-(--color-base-1)">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-(--color-border) bg-(--color-base-2)">
              <FiActivity className="text-sm text-(--color-primary)" />
            </div>
            <h2 className="text-lg font-bold">{t("recentActivity")}</h2>
          </div>

          <div className="mt-4">
            {data.recentActivity.length === 0 ? (
              <p className="py-10 text-center text-sm text-(--color-text-2)">
                {t("noRecentActivity")}
              </p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {data.recentActivity.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-(--color-border) bg-(--color-base-2) p-3 transition-colors hover:bg-(--color-base-3)"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-(--color-primary)" />
                      <p className="text-sm font-medium">{a.message}</p>
                    </div>
                    <span className="shrink-0 text-xs text-(--color-text-2)">
                      {a.createdAtLabel}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        {/* Próximos Atendimentos */}
        <Card className="border border-(--color-border) bg-(--color-base-1)">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-(--color-border) bg-(--color-base-2)">
                <FiClock className="text-sm text-(--color-primary)" />
              </div>
              <h2 className="text-lg font-bold">{t("upcomingServices")}</h2>
            </div>
            <Link href="/schedule">
              <Button fit type="default">
                <span className="inline-flex items-center gap-1">
                  {t("viewAll")}
                  <FiChevronRight className="text-xs" />
                </span>
              </Button>
            </Link>
          </div>

          <div className="mt-4">
            {data.upcomingServices.length === 0 ? (
              <p className="py-10 text-center text-sm text-(--color-text-2)">
                {t("noUpcomingServices")}
              </p>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {data.upcomingServices.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-(--color-border) bg-(--color-base-2) p-3.5 transition-colors hover:bg-(--color-base-3)"
                  >
                    <div>
                      <p className="font-semibold text-sm">{s.title}</p>
                      <p className="mt-0.5 text-xs text-(--color-text-2)">
                        {s.customerName ? `${s.customerName} • ` : ""}
                        {s.startsAtLabel}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-lg border border-(--color-primary)/20 bg-(--color-primary)/10 px-2.5 py-1 text-xs font-semibold text-(--color-primary)">
                      {s.startsAtLabel.split(" ")[0] || "Agendado"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </section>

      {/* Modal de Agendamento da Sugestão com 1 Clique */}
      <RecurrenceSuggestionModal
        open={Boolean(selectedAlert)}
        suggestion={suggestion}
        onClose={() => setSelectedAlert(null)}
        onScheduled={() => {
          setSelectedAlert(null);
          router.refresh();
        }}
      />
    </div>
  );
}
