import {
  buildGoogleMapsUrl,
  buildWazeUrl,
  buildWhatsAppUrl,
  formatFullAddress,
  updateOrderStatusSchema,
} from "@protogestor/shared";
import { describe, expect, it } from "vitest";

describe("Mobile Domain Contracts & Integrations", () => {
  it("validates valid status transitions for service orders", () => {
    const validStatuses = [
      "draft",
      "scheduled",
      "in_progress",
      "completed",
      "canceled",
    ];

    for (const status of validStatuses) {
      const result = updateOrderStatusSchema.safeParse({ status });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid status transitions", () => {
    const result = updateOrderStatusSchema.safeParse({ status: "finished" });
    expect(result.success).toBe(false);
  });

  it("formats full address cleanly for mobile cards", () => {
    const formatted = formatFullAddress({
      line1: "Av. Paulista, 1000",
      city: "São Paulo",
      state: "SP",
    });
    expect(formatted).toBe("Av. Paulista, 1000, São Paulo - SP");
  });

  it("generates correct GPS and WhatsApp deep links for field technicians", () => {
    const mapsUrl = buildGoogleMapsUrl({
      line1: "Av. Paulista, 1000",
      city: "São Paulo",
      state: "SP",
    });
    expect(mapsUrl).toContain(
      "https://www.google.com/maps/search/?api=1&query=",
    );
    expect(mapsUrl).toContain("Av.%20Paulista");

    const wazeUrl = buildWazeUrl({
      line1: "Av. Paulista, 1000",
      city: "São Paulo",
      state: "SP",
    });
    expect(wazeUrl).toContain("https://waze.com/ul?q=");
    expect(wazeUrl).toContain("navigate=yes");

    const whatsUrl = buildWhatsAppUrl("11999998888", "A caminho");
    expect(whatsUrl).toContain("https://wa.me/5511999998888?text=A%20caminho");
  });
});
