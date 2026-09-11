import { describe, expect, it } from "vitest";
import { formatRoleLabel } from "@/lib/members-utils";

describe("formatRoleLabel", () => {
  it("formata rótulos em pt-BR corretamente", () => {
    expect(formatRoleLabel("owner", "pt-BR")).toBe("Proprietário");
    expect(formatRoleLabel("admin", "pt-BR")).toBe("Administrador");
    expect(formatRoleLabel("member", "pt-BR")).toBe("Colaborador");
  });

  it("formata rótulos em en corretamente", () => {
    expect(formatRoleLabel("owner", "en")).toBe("Owner");
    expect(formatRoleLabel("admin", "en")).toBe("Admin");
    expect(formatRoleLabel("member", "en")).toBe("Collaborator");
  });
});
