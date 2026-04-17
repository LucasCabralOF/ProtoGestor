import type { AppLocale } from "@/utils/i18n";

export const MARKETING_FEATURE_IDS = [
  "clients",
  "schedule",
  "orders",
  "finance",
  "reports",
] as const;

export const MARKETING_SEGMENT_IDS = [
  "maintenance",
  "hvac",
  "pestControl",
  "facilities",
  "propertyServices",
  "gardens",
  "fieldSupport",
] as const;

export const MARKETING_STEP_IDS = ["clients", "visits", "collections"] as const;

export const MARKETING_FAQ_IDS = ["who", "erp", "install", "team"] as const;

export type MarketingPlanId = "founders" | "operation" | "team";

export type MarketingPlanDefinition = {
  ctaHref: string;
  featured: boolean;
  id: MarketingPlanId;
  priceCents: number;
};

export const MARKETING_PRICING_PLANS: readonly MarketingPlanDefinition[] = [
  {
    id: "founders",
    priceCents: 4900,
    featured: false,
    ctaHref: "/signup",
  },
  {
    id: "operation",
    priceCents: 8900,
    featured: true,
    ctaHref: "/signup",
  },
  {
    id: "team",
    priceCents: 14900,
    featured: false,
    ctaHref: "/signup",
  },
] as const;

export function getFeaturedMarketingPlan(
  plans: readonly MarketingPlanDefinition[] = MARKETING_PRICING_PLANS,
): MarketingPlanDefinition {
  const featured = plans.find((plan) => plan.featured);

  if (featured) return featured;

  return plans[0];
}

export function formatMarketingPrice(
  locale: AppLocale,
  priceCents: number,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}
