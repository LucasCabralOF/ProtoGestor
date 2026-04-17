// src/lib/schedule-utils.ts
// Funções puras do módulo de agenda — sem dependências server-only.
// Exportadas aqui para serem testáveis com Vitest sem "server-only".

import type { AppLocale } from "@/utils/i18n";

// ---------------------------------------------------------------------------
// Recorrência
// ---------------------------------------------------------------------------

/** Intervalo em ms para cada regra de recorrência baseada em dias fixos */
const RECURRENCE_INTERVALS_MS: Record<string, number> = {
  weekly: 7 * 24 * 60 * 60 * 1000,
  biweekly: 14 * 24 * 60 * 60 * 1000,
};

/**
 * Gera o array de pares {startsAt, endsAt} para cada ocorrência da série.
 *
 * Regras:
 * - `none`     → sempre 1 elemento, `count` ignorado
 * - `weekly`   → intervalo fixo de 7 dias
 * - `biweekly` → intervalo fixo de 14 dias
 * - `monthly`  → 1 mês calendário (preserva dia/hora/min/seg)
 * - count é clampado em [1, 52]
 */
export function buildRecurrenceDates(
  startsAt: Date,
  endsAt: Date,
  rule: "none" | "weekly" | "biweekly" | "monthly",
  count: number,
): { startsAt: Date; endsAt: Date }[] {
  if (rule === "none") {
    return [{ startsAt, endsAt }];
  }

  const safeCount = Math.min(Math.max(1, count), 52);
  const durationMs = endsAt.getTime() - startsAt.getTime();
  const results: { startsAt: Date; endsAt: Date }[] = [];

  for (let i = 0; i < safeCount; i++) {
    let newStart: Date;

    if (rule === "monthly") {
      newStart = new Date(startsAt);
      newStart.setUTCMonth(newStart.getUTCMonth() + i);
    } else {
      const intervalMs = RECURRENCE_INTERVALS_MS[rule];
      newStart = new Date(startsAt.getTime() + i * intervalMs);
    }

    const newEnd = new Date(newStart.getTime() + durationMs);
    results.push({ startsAt: newStart, endsAt: newEnd });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Formatadores de data/hora/moeda
// ---------------------------------------------------------------------------

/** Formata uma Date como string de data (sem hora) no locale fornecido. */
export function formatDateLabel(date: Date, locale: AppLocale): string {
  return date.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
}

/** Formata uma Date como string de hora HH:MM no locale fornecido. */
export function formatTimeLabel(date: Date, locale: AppLocale): string {
  return date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

/** Formata centavos como label de moeda no locale fornecido. */
export function centsToCurrencyLabel(cents: number, locale: AppLocale): string {
  return (cents / 100).toLocaleString(locale, {
    style: "currency",
    currency: "BRL",
  });
}
