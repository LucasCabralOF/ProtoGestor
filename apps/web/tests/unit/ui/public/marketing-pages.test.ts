import { describe, expect, it } from "vitest";
import {
  MARKETING_DIFFERENTIAL_IDS,
  MARKETING_FEATURE_IDS,
  MARKETING_PAIN_SOLUTION_IDS,
  MARKETING_PRICING_PLANS,
  MARKETING_SEGMENT_IDS,
  MARKETING_STEP_IDS,
} from "@/lib/public-site";

describe("MarketingHomePage — catálogos estáticos", () => {
  it("MARKETING_FEATURE_IDS contém exatamente os 5 módulos do produto", () => {
    expect(MARKETING_FEATURE_IDS).toHaveLength(5);
    expect(MARKETING_FEATURE_IDS).toContain("clients");
    expect(MARKETING_FEATURE_IDS).toContain("schedule");
    expect(MARKETING_FEATURE_IDS).toContain("orders");
    expect(MARKETING_FEATURE_IDS).toContain("finance");
    expect(MARKETING_FEATURE_IDS).toContain("reports");
  });

  it("MARKETING_STEP_IDS contém exatamente os 3 passos do onboarding de marketing", () => {
    expect(MARKETING_STEP_IDS).toHaveLength(3);
    expect(MARKETING_STEP_IDS).toContain("clients");
    expect(MARKETING_STEP_IDS).toContain("visits");
    expect(MARKETING_STEP_IDS).toContain("collections");
  });

  it("MARKETING_SEGMENT_IDS não possui duplicatas", () => {
    const unique = new Set(MARKETING_SEGMENT_IDS);
    expect(unique.size).toBe(MARKETING_SEGMENT_IDS.length);
  });

  it("MARKETING_FEATURE_IDS não possui duplicatas — garante que chaves React sejam únicas", () => {
    const unique = new Set(MARKETING_FEATURE_IDS);
    expect(unique.size).toBe(MARKETING_FEATURE_IDS.length);
  });

  it("MARKETING_DIFFERENTIAL_IDS contém os 4 diferenciais do produto sem duplicatas", () => {
    expect(MARKETING_DIFFERENTIAL_IDS).toHaveLength(4);
    expect(MARKETING_DIFFERENTIAL_IDS).toContain("setup");
    expect(MARKETING_DIFFERENTIAL_IDS).toContain("multiOrg");
    expect(MARKETING_DIFFERENTIAL_IDS).toContain("noErpWeight");
    expect(MARKETING_DIFFERENTIAL_IDS).toContain("brazilFit");
    const unique = new Set(MARKETING_DIFFERENTIAL_IDS);
    expect(unique.size).toBe(4);
  });

  it("MARKETING_PAIN_SOLUTION_IDS contém as 4 dores principais vs 4 soluções", () => {
    expect(MARKETING_PAIN_SOLUTION_IDS).toHaveLength(4);
    expect(MARKETING_PAIN_SOLUTION_IDS).toContain("recurrence");
    expect(MARKETING_PAIN_SOLUTION_IDS).toContain("clientHistory");
    expect(MARKETING_PAIN_SOLUTION_IDS).toContain("scheduleCoord");
    expect(MARKETING_PAIN_SOLUTION_IDS).toContain("cashflow");
    const unique = new Set(MARKETING_PAIN_SOLUTION_IDS);
    expect(unique.size).toBe(4);
  });
});

describe("MarketingPricingPage — unicidade de chaves na tabela de comparação", () => {
  it("cada plano possui ID único — evita chaves duplicadas no header da tabela", () => {
    const ids = MARKETING_PRICING_PLANS.map((p) => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("a tabela tem exatamente 3 planos — array fixo de colunas da comparação", () => {
    expect(MARKETING_PRICING_PLANS).toHaveLength(3);
  });

  it("planos estão associados na ordem: starter, pro, enterprise", () => {
    const [first, second, third] = MARKETING_PRICING_PLANS;
    expect(first.id).toBe("starter");
    expect(second.id).toBe("pro");
    expect(third.id).toBe("enterprise");
  });
});
