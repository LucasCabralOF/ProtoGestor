import { describe, expect, it } from "vitest";
import {
  isNewAccount,
  validateStep1,
  validateStep2,
} from "@/ui/pages/onboarding/onboarding-utils";

describe("onboarding wizard — validateStep1", () => {
  it("aceita dados válidos sem erros", () => {
    expect(
      validateStep1({ name: "Minha Empresa", segment: "maintenance" }),
    ).toHaveLength(0);
  });

  it("rejeita nome ausente", () => {
    const errors = validateStep1({ name: "", segment: "hvac" });
    expect(errors).toContain("name");
  });

  it("rejeita nome com menos de 2 caracteres", () => {
    const errors = validateStep1({ name: "A", segment: "hvac" });
    expect(errors).toContain("name");
  });

  it("rejeita segmento ausente", () => {
    const errors = validateStep1({ name: "Empresa SA", segment: "" });
    expect(errors).toContain("segment");
  });

  it("acumula múltiplos erros quando nome e segmento estão ausentes", () => {
    const errors = validateStep1({});
    expect(errors).toContain("name");
    expect(errors).toContain("segment");
    expect(errors).toHaveLength(2);
  });
});

describe("onboarding wizard — validateStep2", () => {
  it("aceita dados válidos sem erros", () => {
    expect(
      validateStep2({ clientCount: "few", tool: "whatsapp" }),
    ).toHaveLength(0);
  });

  it("rejeita clientCount ausente", () => {
    const errors = validateStep2({ tool: "spreadsheet" });
    expect(errors).toContain("clientCount");
  });

  it("rejeita tool ausente", () => {
    const errors = validateStep2({ clientCount: "medium" });
    expect(errors).toContain("tool");
  });
});

describe("dashboard checklist — isNewAccount", () => {
  it("retorna true quando não há clientes cadastrados", () => {
    expect(isNewAccount(0)).toBe(true);
  });

  it("retorna false quando há pelo menos 1 cliente", () => {
    expect(isNewAccount(1)).toBe(false);
  });

  it("retorna false para contas com muitos clientes", () => {
    expect(isNewAccount(200)).toBe(false);
  });
});
