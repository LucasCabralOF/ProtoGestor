// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { scheduleNextRecurringAppointmentAction } from "@/actions/(private)/schedule";
import type { RecurrenceSuggestion } from "@/lib/recurrence-utils";
import { RecurrenceSuggestionModal } from "@/ui/pages/privatePages/RecurrenceSuggestionModal";

afterEach(() => {
  cleanup();
});

vi.mock("@/actions/(private)/schedule", () => ({
  scheduleNextRecurringAppointmentAction: vi.fn(),
}));

vi.mock("@/ui/base/useAppFeedback", () => ({
  useAppFeedback: () => ({
    notifySuccess: vi.fn(),
    notifyError: vi.fn(),
    confirm: vi.fn().mockResolvedValue(true),
  }),
}));

const mockSuggestion: RecurrenceSuggestion = {
  serviceOrderId: "so-123",
  serviceTitle: "Manutenção Preventiva",
  customerId: "cust-1",
  customerName: "Fernanda Costa",
  customerPhone: "11977776666",
  locationText: "Av Paulista, 500",
  recurrenceRule: "monthly",
  recurrenceRuleLabel: "Mensal",
  suggestedDate: "2026-06-15",
  suggestedDateLabel: "15/06/2026",
  suggestedStartTime: "09:00",
  suggestedEndTime: "10:30",
};

describe("RecurrenceSuggestionModal", () => {
  it("renderiza os detalhes do serviço recorrente e datas sugeridas", () => {
    const onClose = vi.fn();
    render(
      <RecurrenceSuggestionModal
        open={true}
        suggestion={mockSuggestion}
        onClose={onClose}
      />,
    );

    expect(screen.getByText("Ciclo de Recorrência Detectado")).toBeDefined();
    expect(screen.getByText("Manutenção Preventiva")).toBeDefined();
    expect(screen.getByText("Fernanda Costa")).toBeDefined();
    expect(screen.getByText("Mensal")).toBeDefined();

    const dateInput = screen.getByTestId(
      "input-recurrence-date",
    ) as HTMLInputElement;
    expect(dateInput.value).toBe("2026-06-15");

    const startTimeInput = screen.getByTestId(
      "input-recurrence-start-time",
    ) as HTMLInputElement;
    expect(startTimeInput.value).toBe("09:00");

    const endTimeInput = screen.getByTestId(
      "input-recurrence-end-time",
    ) as HTMLInputElement;
    expect(endTimeInput.value).toBe("10:30");
  });

  it("dispara onClose ao clicar em Agora Não", () => {
    const onClose = vi.fn();
    render(
      <RecurrenceSuggestionModal
        open={true}
        suggestion={mockSuggestion}
        onClose={onClose}
      />,
    );

    const cancelBtn = screen.getByTestId("button-cancel-recurrence");
    fireEvent.click(cancelBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("chama action e onScheduled ao confirmar agendamento", async () => {
    const onClose = vi.fn();
    const onScheduled = vi.fn();

    vi.mocked(scheduleNextRecurringAppointmentAction).mockResolvedValue({
      data: { ok: true, appointmentId: "app-next-1" },
    } as never);

    render(
      <RecurrenceSuggestionModal
        open={true}
        suggestion={mockSuggestion}
        onClose={onClose}
        onScheduled={onScheduled}
      />,
    );

    const confirmBtn = screen.getByTestId("button-confirm-recurrence");
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(scheduleNextRecurringAppointmentAction).toHaveBeenCalledWith({
        serviceOrderId: "so-123",
        customerId: "cust-1",
        date: "2026-06-15",
        startTime: "09:00",
        endTime: "10:30",
        locationText: "Av Paulista, 500",
        notes: "Retorno periódico (Mensal) - Manutenção Preventiva",
        recurrenceRule: "monthly",
      });
      expect(onScheduled).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
