import { describe, expect, it } from "vitest";
import {
  buildUniqueOrganizationSlug,
  slugifyOrganizationName,
} from "./org-slug";

describe("slugifyOrganizationName", () => {
  it("normalizes accents, casing and spacing", () => {
    expect(slugifyOrganizationName("  Organização Ágil  ")).toBe(
      "organizacao-agil",
    );
  });

  it("falls back when the name has no slug-safe characters", () => {
    expect(slugifyOrganizationName("!!!")).toBe("workspace");
  });
});

describe("buildUniqueOrganizationSlug", () => {
  it("reuses the base slug when it is still available", () => {
    expect(buildUniqueOrganizationSlug("brilho-clean", ["outra-org"])).toBe(
      "brilho-clean",
    );
  });

  it("increments the suffix when the base slug is already taken", () => {
    expect(
      buildUniqueOrganizationSlug("brilho-clean", [
        "brilho-clean",
        "brilho-clean-2",
      ]),
    ).toBe("brilho-clean-3");
  });
});
