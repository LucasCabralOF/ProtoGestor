import { describe, expect, it } from "vitest";
import {
  calculateTrialDaysRemaining,
  formatSubscriptionPrice,
  getPlanDetails,
  getSimulatedSubscriptionInvoices,
  normalizePlanId,
} from "@/lib/subscription-utils";

describe("subscription-utils", () => {
  it("normaliza os IDs de planos corretamente", () => {
    expect(normalizePlanId("starter")).toBe("starter");
    expect(normalizePlanId("founders")).toBe("starter");
    expect(normalizePlanId("pro")).toBe("pro");
    expect(normalizePlanId("operation")).toBe("pro");
    expect(normalizePlanId("enterprise")).toBe("enterprise");
    expect(normalizePlanId("team")).toBe("enterprise");
    expect(normalizePlanId(null)).toBe("starter");
  });

  it("retorna os detalhes corretos de cada plano", () => {
    const starter = getPlanDetails("starter");
    expect(starter.monthlyPriceCents).toBe(4900);
    expect(starter.maxUsersLabel).toContain("1 usuário");

    const pro = getPlanDetails("pro");
    expect(pro.monthlyPriceCents).toBe(9900);
    expect(pro.badge).toBe("Mais Popular");

    const enterprise = getPlanDetails("enterprise");
    expect(enterprise.monthlyPriceCents).toBe(17900);
    expect(enterprise.features.length).toBeGreaterThan(3);
  });

  it("calcula dias restantes do período de teste", () => {
    const now = new Date("2026-09-06T12:00:00Z");
    const trialEndFuture = new Date("2026-09-20T12:00:00Z");
    expect(calculateTrialDaysRemaining(trialEndFuture, now)).toBe(14);

    const trialEndExpired = new Date("2026-09-01T12:00:00Z");
    expect(calculateTrialDaysRemaining(trialEndExpired, now)).toBe(0);

    expect(calculateTrialDaysRemaining(null, now)).toBe(0);
  });

  it("formata o preço da assinatura de acordo com o ciclo", () => {
    const monthlyPrice = formatSubscriptionPrice("starter", "monthly");
    expect(monthlyPrice).toContain("49");

    const yearlyEquivalent = formatSubscriptionPrice("starter", "yearly");
    expect(yearlyEquivalent).toContain("39");
  });

  it("retorna faturas simuladas da plataforma", () => {
    const invoices = getSimulatedSubscriptionInvoices("pro", "monthly");
    expect(invoices.length).toBeGreaterThanOrEqual(1);
    expect(invoices[0].status).toBe("paid");
    expect(invoices[0].amount).toContain("99");
  });
});
