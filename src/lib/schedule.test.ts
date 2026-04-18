import { describe, expect, it } from "vitest";
import {
  buildRecurrenceDates,
  centsToCurrencyLabel,
  formatDateLabel,
  formatTimeLabel,
} from "./schedule-utils";

// ---------------------------------------------------------------------------
// buildRecurrenceDates
// ---------------------------------------------------------------------------

describe("buildRecurrenceDates", () => {
  const base = new Date("2025-06-02T09:00:00-03:00"); // segunda-feira
  const end = new Date("2025-06-02T10:00:00-03:00");
  const durationMs = end.getTime() - base.getTime();

  it("none — retorna apenas a data original", () => {
    const dates = buildRecurrenceDates(base, end, "none", 1);
    expect(dates).toHaveLength(1);
    expect(dates[0].startsAt).toEqual(base);
    expect(dates[0].endsAt).toEqual(end);
  });

  it("none com count > 1 — ainda retorna só 1 (count ignorado para none)", () => {
    const dates = buildRecurrenceDates(base, end, "none", 5);
    expect(dates).toHaveLength(1);
  });

  it("weekly — gera N datas com intervalo de 7 dias", () => {
    const dates = buildRecurrenceDates(base, end, "weekly", 4);
    expect(dates).toHaveLength(4);
    for (let i = 0; i < 4; i++) {
      const expectedStart = new Date(
        base.getTime() + i * 7 * 24 * 60 * 60 * 1000,
      );
      const expectedEnd = new Date(expectedStart.getTime() + durationMs);
      expect(dates[i].startsAt.getTime()).toBe(expectedStart.getTime());
      expect(dates[i].endsAt.getTime()).toBe(expectedEnd.getTime());
    }
  });

  it("biweekly — gera N datas com intervalo de 14 dias", () => {
    const dates = buildRecurrenceDates(base, end, "biweekly", 3);
    expect(dates).toHaveLength(3);
    for (let i = 0; i < 3; i++) {
      const expectedStart = new Date(
        base.getTime() + i * 14 * 24 * 60 * 60 * 1000,
      );
      expect(dates[i].startsAt.getTime()).toBe(expectedStart.getTime());
    }
  });

  it("monthly — gera N datas avançando 1 mês calendar a cada ocorrência", () => {
    const dates = buildRecurrenceDates(base, end, "monthly", 3);
    expect(dates).toHaveLength(3);
    // mês 0: junho
    expect(dates[0].startsAt.getUTCMonth()).toBe(base.getUTCMonth());
    // mês 1: julho
    expect(dates[1].startsAt.getUTCMonth()).toBe((base.getUTCMonth() + 1) % 12);
    // mês 2: agosto
    expect(dates[2].startsAt.getUTCMonth()).toBe((base.getUTCMonth() + 2) % 12);
  });

  it("count = 1 com weekly — retorna somente a data raiz", () => {
    const dates = buildRecurrenceDates(base, end, "weekly", 1);
    expect(dates).toHaveLength(1);
    expect(dates[0].startsAt).toEqual(base);
  });

  it("count máximo de 52 é respeitado", () => {
    const dates = buildRecurrenceDates(base, end, "weekly", 52);
    expect(dates).toHaveLength(52);
  });
});

// ---------------------------------------------------------------------------
// centsToCurrencyLabel
// ---------------------------------------------------------------------------

describe("centsToCurrencyLabel", () => {
  it("converte zero corretamente", () => {
    expect(centsToCurrencyLabel(0, "pt-BR")).toBe("R$\u00a00,00");
  });

  it("converte valor inteiro", () => {
    expect(centsToCurrencyLabel(10000, "pt-BR")).toBe("R$\u00a0100,00");
  });

  it("converte valor com centavos", () => {
    expect(centsToCurrencyLabel(9999, "pt-BR")).toBe("R$\u00a099,99");
  });
});

// ---------------------------------------------------------------------------
// formatDateLabel e formatTimeLabel
// ---------------------------------------------------------------------------

describe("formatDateLabel", () => {
  it("formata data ISO para pt-BR sem hora", () => {
    const d = new Date("2025-06-02T12:00:00Z");
    const label = formatDateLabel(d, "pt-BR");
    // dd/mm/aaaa
    expect(label).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it("formata data ISO para en sem hora", () => {
    const d = new Date("2025-06-02T12:00:00Z");
    const label = formatDateLabel(d, "en");
    // m/d/yyyy
    expect(label).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
  });
});

describe("formatTimeLabel", () => {
  it("formata hora no padrão HH:MM", () => {
    const d = new Date("2025-06-02T14:30:00Z");
    const label = formatTimeLabel(d, "pt-BR");
    expect(label).toMatch(/\d{2}:\d{2}/);
  });
});
