import { describe, expect, it } from "vitest";
import {
  getFeaturedMarketingPlan,
  MARKETING_PRICING_PLANS,
} from "./public-site";

describe("public site pricing catalog", () => {
  it("marks the operation plan as the featured offer", () => {
    expect(getFeaturedMarketingPlan().id).toBe("operation");
  });

  it("keeps plans ordered from lowest to highest monthly price", () => {
    const prices = MARKETING_PRICING_PLANS.map((plan) => plan.priceCents);

    expect(prices).toEqual([4900, 8900, 14900]);
  });

  it("routes every pricing CTA through the public signup flow", () => {
    expect(
      MARKETING_PRICING_PLANS.every((plan) => plan.ctaHref === "/signup"),
    ).toBe(true);
  });
});
