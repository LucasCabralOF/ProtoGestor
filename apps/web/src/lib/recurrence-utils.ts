import { addDays, addMonths, format } from "date-fns";
import type { AppLocale } from "@/utils/i18n";

export type RecurrenceRule = "none" | "weekly" | "biweekly" | "monthly";

export type RecurrenceSuggestion = {
  customerId: string | null;
  customerName: string | null;
  customerPhone?: string | null;
  locationText: string | null;
  recurrenceRule: "weekly" | "biweekly" | "monthly";
  recurrenceRuleLabel: string;
  serviceOrderId: string | null;
  serviceTitle: string;
  suggestedDate: string; // YYYY-MM-DD
  suggestedDateLabel: string; // DD/MM/YYYY
  suggestedEndTime: string; // HH:mm
  suggestedStartTime: string; // HH:mm
};

export type ReturnAlertItem = {
  customerId: string;
  customerName: string;
  customerPhone: string | null;
  dueReturnDate: Date;
  dueReturnDateLabel: string;
  id: string;
  isOverdue: boolean;
  lastCompletedAt: Date;
  lastCompletedAtLabel: string;
  recurrenceRule: "weekly" | "biweekly" | "monthly";
  recurrenceRuleLabel: string;
  serviceOrderId: string | null;
  serviceTitle: string;
  suggestedDate: string;
  suggestedEndTime: string;
  suggestedStartTime: string;
};

export function getRecurrenceRuleLabel(
  rule: RecurrenceRule,
  locale: AppLocale = "pt-BR",
): string {
  const labels: Record<RecurrenceRule, Record<AppLocale, string>> = {
    none: { "pt-BR": "Sem recorrência", en: "None" },
    weekly: { "pt-BR": "Semanal", en: "Weekly" },
    biweekly: { "pt-BR": "Quinzenal", en: "Biweekly" },
    monthly: { "pt-BR": "Mensal", en: "Monthly" },
  };
  return labels[rule]?.[locale] ?? rule;
}

/**
 * Calcula a próxima data sugerida com base na regra de recorrência.
 */
export function calculateNextRecurringDate(
  baseDate: Date,
  rule: RecurrenceRule,
): Date {
  switch (rule) {
    case "weekly":
      return addDays(baseDate, 7);
    case "biweekly":
      return addDays(baseDate, 14);
    case "monthly":
      return addMonths(baseDate, 1);
    default:
      return baseDate;
  }
}

/**
 * Monta o payload de sugestão para abrir o modal pós-conclusão.
 */
export function buildRecurrenceSuggestion({
  baseDate = new Date(),
  customerId = null,
  customerName = null,
  customerPhone = null,
  locationText = null,
  recurrenceRule,
  serviceOrderId = null,
  serviceTitle,
  startTime = "09:00",
  endTime = "10:00",
  locale = "pt-BR",
}: {
  baseDate?: Date;
  customerId?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  endTime?: string;
  locale?: AppLocale;
  locationText?: string | null;
  recurrenceRule: "weekly" | "biweekly" | "monthly";
  serviceOrderId?: string | null;
  serviceTitle: string;
  startTime?: string;
}): RecurrenceSuggestion {
  const nextDate = calculateNextRecurringDate(baseDate, recurrenceRule);
  const suggestedDate = format(nextDate, "yyyy-MM-dd");
  const suggestedDateLabel = format(nextDate, "dd/MM/yyyy");

  return {
    serviceOrderId,
    serviceTitle,
    customerId,
    customerName,
    customerPhone,
    locationText,
    recurrenceRule,
    recurrenceRuleLabel: getRecurrenceRuleLabel(recurrenceRule, locale),
    suggestedDate,
    suggestedDateLabel,
    suggestedStartTime: startTime,
    suggestedEndTime: endTime,
  };
}

/**
 * Mensagem amigável para lembrete de retorno periódico via WhatsApp.
 */
export function buildWhatsAppReturnReminderMessage({
  customerName,
  orgName = "Nossa Empresa",
  serviceTitle,
  recurrenceRuleLabel,
}: {
  customerName: string;
  orgName?: string;
  recurrenceRuleLabel: string;
  serviceTitle: string;
}): string {
  return (
    `Olá, ${customerName}! Aqui é da equipe ${orgName}. ` +
    `Identificamos que já está no período de renovação do seu serviço "${serviceTitle}" (${recurrenceRuleLabel}). ` +
    `Gostaria de agendar a sua próxima visita técnica para mantermos tudo em dia?`
  );
}
