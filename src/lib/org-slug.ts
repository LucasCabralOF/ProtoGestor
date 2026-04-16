const FALLBACK_ORGANIZATION_SLUG = "workspace";
const MAX_SLUG_LENGTH = 48;

function trimSlugEdges(value: string) {
  return value.replace(/^-+|-+$/g, "");
}

export function slugifyOrganizationName(value: string): string {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  const trimmed = trimSlugEdges(normalized).slice(0, MAX_SLUG_LENGTH);
  const collapsed = trimSlugEdges(trimmed).replace(/-{2,}/g, "-");

  return collapsed || FALLBACK_ORGANIZATION_SLUG;
}

export function buildUniqueOrganizationSlug(
  baseSlug: string,
  existingSlugs: string[],
): string {
  const normalizedBase = slugifyOrganizationName(baseSlug);
  const taken = new Set(existingSlugs);

  if (!taken.has(normalizedBase)) {
    return normalizedBase;
  }

  let suffix = 2;
  while (taken.has(`${normalizedBase}-${suffix}`)) {
    suffix += 1;
  }

  return `${normalizedBase}-${suffix}`;
}
