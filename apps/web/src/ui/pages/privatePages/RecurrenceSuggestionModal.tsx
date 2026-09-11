"use client";

import { useEffect, useState } from "react";
import { FiCalendar, FiClock, FiRepeat } from "react-icons/fi";
import { scheduleNextRecurringAppointmentAction } from "@/actions/(private)/schedule";
import type { RecurrenceSuggestion } from "@/lib/recurrence-utils";
import { Button } from "@/ui/base/Button";
import { Modal } from "@/ui/base/Modal";
import { useAppFeedback } from "@/ui/base/useAppFeedback";

type RecurrenceSuggestionModalProps = {
  onClose: () => void;
  onScheduled?: () => void;
  open: boolean;
  suggestion: RecurrenceSuggestion | null;
};

export function RecurrenceSuggestionModal({
  open,
  suggestion,
  onClose,
  onScheduled,
}: RecurrenceSuggestionModalProps) {
  const feedback = useAppFeedback();
  const [saving, setSaving] = useState(false);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (suggestion) {
      setDate(suggestion.suggestedDate);
      setStartTime(suggestion.suggestedStartTime);
      setEndTime(suggestion.suggestedEndTime);
      setNotes(
        `Retorno periódico (${suggestion.recurrenceRuleLabel}) - ${suggestion.serviceTitle}`,
      );
    }
  }, [suggestion]);

  if (!suggestion) return null;

  async function handleConfirm() {
    if (!suggestion) return;
    if (!date || !startTime || !endTime) {
      feedback.notifyError("Preencha a data e os horários para a visita.");
      return;
    }

    setSaving(true);
    try {
      const result = await scheduleNextRecurringAppointmentAction({
        serviceOrderId: suggestion.serviceOrderId,
        customerId: suggestion.customerId,
        date,
        startTime,
        endTime,
        locationText: suggestion.locationText,
        notes,
        recurrenceRule: suggestion.recurrenceRule,
      });

      if (!result?.data?.ok) {
        throw new Error(result?.serverError || "Erro ao agendar visita");
      }

      feedback.notifySuccess(
        `Próxima visita agendada com sucesso para ${suggestion.suggestedDateLabel}!`,
      );
      onScheduled?.();
      onClose();
    } catch (err) {
      feedback.notifyError(err, {
        fallback: "Não foi possível agendar a próxima visita.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      testid="recurrence-suggestion"
      width={520}
      title={
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <FiRepeat className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-(--color-text)">
              Ciclo de Recorrência Detectado
            </h3>
            <p className="text-xs text-(--color-text-2)">
              Sugestão automática de continuidade do atendimento
            </p>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 py-2">
        {/* Banner do Serviço */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs text-(--color-text)">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-blue-600">
              {suggestion.serviceTitle}
            </span>
            <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 font-bold text-blue-600 border border-blue-500/30">
              {suggestion.recurrenceRuleLabel}
            </span>
          </div>

          <p className="mt-2 text-(--color-text-2)">
            O atendimento para o cliente{" "}
            <strong className="text-(--color-text)">
              {suggestion.customerName || "o cliente"}
            </strong>{" "}
            foi concluído. Deseja agendar a próxima visita periódica na agenda?
          </p>
        </div>

        {/* Campos de Ajuste Rápido */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="recurrence-date"
              className="text-xs font-semibold text-(--color-text-2) flex items-center gap-1"
            >
              <FiCalendar className="h-3.5 w-3.5" />
              <span>Data Sugerida</span>
            </label>
            <input
              id="recurrence-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border border-(--color-border) bg-(--color-base-2) px-3 py-2 text-xs font-medium text-(--color-text) outline-none transition-all focus:border-blue-500"
              data-testid="input-recurrence-date"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="recurrence-start-time"
              className="text-xs font-semibold text-(--color-text-2) flex items-center gap-1"
            >
              <FiClock className="h-3.5 w-3.5" />
              <span>Início</span>
            </label>
            <input
              id="recurrence-start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-xl border border-(--color-border) bg-(--color-base-2) px-3 py-2 text-xs font-medium text-(--color-text) outline-none transition-all focus:border-blue-500"
              data-testid="input-recurrence-start-time"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="recurrence-end-time"
              className="text-xs font-semibold text-(--color-text-2) flex items-center gap-1"
            >
              <FiClock className="h-3.5 w-3.5" />
              <span>Término</span>
            </label>
            <input
              id="recurrence-end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-xl border border-(--color-border) bg-(--color-base-2) px-3 py-2 text-xs font-medium text-(--color-text) outline-none transition-all focus:border-blue-500"
              data-testid="input-recurrence-end-time"
            />
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-2 flex items-center justify-end gap-2 border-t border-(--color-border) pt-4">
          <Button
            type="default"
            disabled={saving}
            onClick={onClose}
            testid="cancel-recurrence"
          >
            Agora Não
          </Button>

          <Button
            type="primary"
            loading={saving}
            onClick={() => void handleConfirm()}
            testid="confirm-recurrence"
          >
            Agendar Próxima Visita
          </Button>
        </div>
      </div>
    </Modal>
  );
}
