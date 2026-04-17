import { describe, expect, it } from "vitest";
import {
  MARKETING_FEATURE_IDS,
  MARKETING_PRICING_PLANS,
  MARKETING_SEGMENT_IDS,
  MARKETING_STEP_IDS,
} from "@/lib/public-site";

/**
 * Testes para os dados estáticos que alimentam as páginas públicas de marketing.
 * Esses catálogos são usados diretamente como chaves de i18n e como props de layout,
 * por isso garantir a consistência estrutural evita bugs silenciosos em runtime.
 */
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
    // ERR-003: chaves duplicadas em .map() causam aviso React.
    // Catálogos com duplicatas inevitavelmente geram keys colisoras.
    const unique = new Set(MARKETING_FEATURE_IDS);

    expect(unique.size).toBe(MARKETING_FEATURE_IDS.length);
  });
});

/**
 * Testes para a tabela de comparação de planos (MarketingPricingPage).
 * A key de cada célula da tabela usa `${row.label}-col-${index}` (ERR-003).
 * Aqui validamos que os planos têm IDs únicos, que são a base das row-keys do header.
 */
describe("MarketingPricingPage — unicidade de chaves na tabela de comparação", () => {
  it("cada plano possui ID único — evita chaves duplicadas no header da tabela", () => {
    // ERR-003: key baseada em valor duplicado causa conflito React.
    // Os IDs dos planos são usados como key={plan.id} no header da tabela.
    const ids = MARKETING_PRICING_PLANS.map((p) => p.id);
    const unique = new Set(ids);

    expect(unique.size).toBe(ids.length);
  });

  it("a tabela tem exatamente 3 planos — array fixo de colunas da comparação", () => {
    // A tabela de comparação usa [row.founders, row.operation, row.team] — array de 3.
    // Se o número de planos mudar, a estrutura da tabela precisa ser revisada.
    expect(MARKETING_PRICING_PLANS).toHaveLength(3);
  });

  it("planos estão associados na ordem: founders, operation, team", () => {
    const [first, second, third] = MARKETING_PRICING_PLANS;

    expect(first.id).toBe("founders");
    expect(second.id).toBe("operation");
    expect(third.id).toBe("team");
  });
});
