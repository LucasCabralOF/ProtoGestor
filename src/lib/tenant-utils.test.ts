import { describe, expect, it } from "vitest";
import type { OrganizationSummary } from "../types/base";
import { pickActiveOrganization } from "./tenant-utils";

const ORGANIZATIONS: OrganizationSummary[] = [
  {
    id: "org_1",
    name: "Empresa Teste",
    role: "owner",
    slug: "empresa-teste",
  },
  {
    id: "org_2",
    name: "Filial Norte",
    role: "admin",
    slug: "filial-norte",
  },
];

describe("pickActiveOrganization", () => {
  it("returns the preferred organization when it exists", () => {
    expect(pickActiveOrganization(ORGANIZATIONS, "org_2")).toEqual(
      ORGANIZATIONS[1],
    );
  });

  it("falls back to the first organization when the cookie is stale", () => {
    expect(pickActiveOrganization(ORGANIZATIONS, "org_missing")).toEqual(
      ORGANIZATIONS[0],
    );
  });

  it("returns null when the user has no organizations", () => {
    expect(pickActiveOrganization([], "org_1")).toBeNull();
  });
});
