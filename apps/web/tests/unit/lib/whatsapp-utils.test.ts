import { describe, expect, it } from "vitest";
import {
  buildAppointmentWhatsAppMessage,
  buildGoogleMapsUrl,
  buildWazeUrl,
  buildWhatsAppUrl,
  formatFullAddress,
  sanitizePhone,
} from "@/lib/whatsapp-utils";

describe("whatsapp-utils", () => {
  it("sanitiza números de telefone adicionando DDI 55 para números brasileiros", () => {
    expect(sanitizePhone("(48) 99999-1111")).toBe("5548999991111");
    expect(sanitizePhone("48999991111")).toBe("5548999991111");
    expect(sanitizePhone("5548999991111")).toBe("5548999991111");
    expect(sanitizePhone("")).toBe("");
    expect(sanitizePhone(null)).toBe("");
  });

  it("gera links do WhatsApp com mensagem codificada", () => {
    const url = buildWhatsAppUrl("(11) 98888-7777", "Olá João!");
    expect(url).toBe("https://wa.me/5511988887777?text=Ol%C3%A1%20Jo%C3%A3o!");

    const urlWithoutMsg = buildWhatsAppUrl("11988887777");
    expect(urlWithoutMsg).toBe("https://wa.me/5511988887777");

    expect(buildWhatsAppUrl("")).toBeNull();
  });

  it("monta mensagem padrão amigável para confirmação de visita", () => {
    const msg = buildAppointmentWhatsAppMessage({
      customerName: "Maria",
      orgName: "ClimaTech",
      serviceTitle: "Limpeza de Ar-Condicionado",
      scheduledDate: "15/09 às 14:00",
    });

    expect(msg).toContain("Olá, Maria!");
    expect(msg).toContain("ClimaTech");
    expect(msg).toContain("Limpeza de Ar-Condicionado");
    expect(msg).toContain("15/09 às 14:00");
  });

  it("formata endereço completo e gera links do Google Maps e Waze", () => {
    const address = {
      line1: "Av. Paulista, 1000",
      line2: "Apto 42",
      city: "São Paulo",
      state: "SP",
      postalCode: "01310-100",
    };

    const formatted = formatFullAddress(address);
    expect(formatted).toBe(
      "Av. Paulista, 1000, Apto 42, São Paulo - SP, CEP: 01310-100",
    );

    const mapsUrl = buildGoogleMapsUrl(address);
    expect(mapsUrl).toContain(
      "https://www.google.com/maps/search/?api=1&query=",
    );
    expect(mapsUrl).toContain("Av.%20Paulista%2C%201000");

    const wazeUrl = buildWazeUrl(address);
    expect(wazeUrl).toContain("https://waze.com/ul?q=");
    expect(wazeUrl).toContain("navigate=yes");
  });

  it("retorna null para endereços vazios", () => {
    expect(buildGoogleMapsUrl(null)).toBeNull();
    expect(buildWazeUrl({ line1: "" })).toBeNull();
  });
});
