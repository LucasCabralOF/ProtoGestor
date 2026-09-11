import {
  buildGoogleMapsUrl,
  buildWazeUrl,
  buildWhatsAppUrl,
  loginSchema,
  sanitizePhone,
  updateOrderStatusSchema,
} from "@protogestor/shared";
import { describe, expect, it } from "vitest";

describe("@protogestor/shared", () => {
  describe("sanitizePhone & WhatsApp", () => {
    it("adds DDI 55 to brazilian 11-digit mobile numbers", () => {
      expect(sanitizePhone("11999998888")).toBe("5511999998888");
      expect(sanitizePhone("(11) 99999-8888")).toBe("5511999998888");
    });

    it("generates correct WhatsApp URL with encoded message", () => {
      const url = buildWhatsAppUrl("11999998888", "Olá equipe");
      expect(url).toBe("https://wa.me/5511999998888?text=Ol%C3%A1%20equipe");
    });
  });

  describe("GPS navigation URLs", () => {
    it("generates google maps and waze URLs from address input", () => {
      const addr = {
        line1: "Av Paulista, 1000",
        city: "São Paulo",
        state: "SP",
      };
      expect(buildGoogleMapsUrl(addr)).toContain("google.com/maps");
      expect(buildWazeUrl(addr)).toContain("waze.com/ul");
    });
  });

  describe("Shared Zod Schemas", () => {
    it("validates login payload correctly", () => {
      const valid = loginSchema.safeParse({
        email: "test@empresa.com",
        password: "password123",
      });
      expect(valid.success).toBe(true);

      const invalid = loginSchema.safeParse({
        email: "invalid-email",
        password: "123",
      });
      expect(invalid.success).toBe(false);
    });

    it("validates order status transitions", () => {
      expect(
        updateOrderStatusSchema.safeParse({ status: "in_progress" }).success,
      ).toBe(true);
      expect(
        updateOrderStatusSchema.safeParse({ status: "invalid_status" }).success,
      ).toBe(false);
    });
  });
});
