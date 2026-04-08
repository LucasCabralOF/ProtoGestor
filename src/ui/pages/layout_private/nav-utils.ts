export type NavLookupItem = {
  href: string;
  label: string;
};

export type NavLookupGroup<TItem extends NavLookupItem = NavLookupItem> = {
  label: string;
  items: readonly TItem[];
};

export type BreadcrumbItem = {
  title: string;
  href?: string;
};

export function firstPath(pathname: string) {
  return pathname.split("/")[1] ?? "";
}

export function findNavItem<TItem extends NavLookupItem>(
  pathname: string,
  groups: readonly NavLookupGroup<TItem>[],
) {
  const key = `/${firstPath(pathname)}`;

  for (const group of groups) {
    const found = group.items.find((item) => item.href === key);
    if (found) return { group: group.label, item: found };
  }

  return null;
}

export function buildBreadcrumbItems<TItem extends NavLookupItem>(
  pathname: string,
  groups: readonly NavLookupGroup<TItem>[],
): BreadcrumbItem[] {
  const found = findNavItem(pathname, groups);

  if (!found) {
    return [{ title: "Painel", href: "/dashboard" }, { title: "Página" }];
  }

  return [
    { title: "Painel", href: "/dashboard" },
    { title: found.group },
    { title: found.item.label },
  ];
}
