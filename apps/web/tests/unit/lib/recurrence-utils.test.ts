import { describe, expect, it } from "vitest";
import {
  buildRecurrenceSuggestion,
  buildWhatsAppReturnReminderMessage,
  calculateNextRecurringDate,
  getRecurrenceRuleLabel,
} from "@/lib/recurrence-utils";

describe("calculateNextRecurringDate", () => {
  it("adiciona 7 dias para regra semanal (weekly)", () => {
    const base = new Date(2026, 4, 10);
    const next = calculateNextRecurringDate(base, "weekly");
    expect(next.getFullYear()).toBe(2026);
    expect(next.getMonth()).toBe(4);
    expect(next.getDate()).toBe(17);
  });

  it("adiciona 14 dias para regra quinzenal (biweekly)", () => {
    const base = new Date(2026, 4, 10);
    const next = calculateNextRecurringDate(base, "biweekly");
    expect(next.getDate()).toBe(24);
  });

  it("adiciona 1 mês para regra mensal (monthly)", () => {
    const base = new Date(2026, 4, 10);
    const next = calculateNextRecurringDate(base, "monthly");
    expect(next.getMonth()).toBe(5);
    expect(next.getDate()).toBe(10);
  });

  it("retorna a mesma data para regra none", () => {
    const base = new Date(2026, 4, 10);
    const next = calculateNextRecurringDate(base, "none");
    expect(next.getTime()).toBe(base.getTime());
  });
});

describe("getRecurrenceRuleLabel", () => {
  it("retorna os rótulos amigáveis em pt-BR e en", () => {
    expect(getRecurrenceRuleLabel("weekly", "pt-BR")).toBe("Semanal");
    expect(getRecurrenceRuleLabel("biweekly", "pt-BR")).toBe("Quinzenal");
    expect(getRecurrenceRuleLabel("monthly", "pt-BR")).toBe("Mensal");
    expect(getRecurrenceRuleLabel("none", "pt-BR")).toBe("Sem recorrência");

    expect(getRecurrenceRuleLabel("weekly", "en")).toBe("Weekly");
    expect(getRecurrenceRuleLabel("monthly", "en")).toBe("Monthly");
  });
});

describe("buildRecurrenceSuggestion", () => {
  it("monta a sugestão com data calculada e horários corretos", () => {
    const base = new Date(2026, 2, 15);
    const suggestion = buildRecurrenceSuggestion({
      baseDate: base,
      customerId: "cust-1",
      customerName: "Ana Clara",
      recurrenceRule: "monthly",
      serviceOrderId: "so-1",
      serviceTitle: "Limpeza Periódica",
      startTime: "14:00",
      endTime: "16:00",
    });

    expect(suggestion.customerId).toBe("cust-1");
    expect(suggestion.customerName).toBe("Ana Clara");
    expect(suggestion.serviceTitle).toBe("Limpeza Periódica");
    expect(suggestion.recurrenceRule).toBe("monthly");
    expect(suggestion.recurrenceRuleLabel).toBe("Mensal");
    expect(suggestion.suggestedDate).toBe("2026-04-15");
    expect(suggestion.suggestedDateLabel).toBe("15/04/2026");
    expect(suggestion.suggestedStartTime).toBe("14:00");
    expect(suggestion.suggestedEndTime).toBe("16:00");
  });
});

describe("buildWhatsAppReturnReminderMessage", () => {
  it("gera mensagem cordial incluindo nome do cliente, empresa e serviço", () => {
    const msg = buildWhatsAppReturnReminderMessage({
      customerName: "Mariana",
      orgName: "ClimaTech",
      recurrenceRuleLabel: "Semestral",
      serviceTitle: "Manutenção de Ar-Condicionado",
    });

    expect(msg).toContain("Mariana");
    expect(msg).toContain("ClimaTech");
    expect(msg).toContain("Manutenção de Ar-Condicionado");
    expect(msg).toContain("Semestral");
  });
});
