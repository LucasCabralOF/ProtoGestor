import { describe, expect, it } from "vitest";
import { buildPrivateNav } from "@/ui/pages/layout_private/nav";
import type { NavLookupGroup } from "@/ui/pages/layout_private/nav-utils";
import {
  buildBreadcrumbItems,
  findNavItem,
  firstPath,
} from "@/ui/pages/layout_private/nav-utils";

const NAV_GROUPS: readonly NavLookupGroup[] = [
  {
    label: "Geral",
    items: [{ href: "/dashboard", label: "Dashboard" }],
  },
  {
    label: "Operação",
    items: [
      { href: "/clients", label: "Clientes" },
      { href: "/services", label: "Serviços" },
    ],
  },
];

describe("nav helpers", () => {
  it("extracts the first pathname segment", () => {
    expect(firstPath("/clients")).toBe("clients");
    expect(firstPath("/dashboard/metrics")).toBe("dashboard");
    expect(firstPath("/")).toBe("");
  });

  it("finds the registered nav item for the current route", () => {
    const found = findNavItem("/services", NAV_GROUPS);

    expect(found).not.toBeNull();
    expect(found?.group).toBe("Operação");
    expect(found?.item.href).toBe("/services");
    expect(found?.item.label).toBe("Serviços");
  });

  it("builds a fallback breadcrumb for unknown pages", () => {
    expect(buildBreadcrumbItems("/missing", NAV_GROUPS)).toEqual([
      { title: "Painel", href: "/dashboard" },
      { title: "Página" },
    ]);
  });
});

describe("buildPrivateNav RBAC", () => {
  const t = (key: string) => key;

  it("includes /finance and /reports for owner and admin roles", () => {
    const ownerNav = buildPrivateNav(t, "owner");
    const opGroup = ownerNav.find((g) => g.label === "groupOperations");
    const hrefs = opGroup?.items.map((i) => i.href);

    expect(hrefs).toContain("/finance");
    expect(hrefs).toContain("/reports");

    const adminNav = buildPrivateNav(t, "admin");
    const adminHrefs = adminNav
      .find((g) => g.label === "groupOperations")
      ?.items.map((i) => i.href);
    expect(adminHrefs).toContain("/finance");
    expect(adminHrefs).toContain("/reports");
  });

  it("strictly omits /finance and /reports for member role", () => {
    const memberNav = buildPrivateNav(t, "member");
    const opGroup = memberNav.find((g) => g.label === "groupOperations");
    const hrefs = opGroup?.items.map((i) => i.href);

    expect(hrefs).toContain("/clients");
    expect(hrefs).toContain("/schedule");
    expect(hrefs).toContain("/services");

    expect(hrefs).not.toContain("/finance");
    expect(hrefs).not.toContain("/reports");
  });
});
