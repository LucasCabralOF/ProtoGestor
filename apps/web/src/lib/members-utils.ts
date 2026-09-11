import type { AppLocale } from "@/utils/i18n";

export type OrgMemberRole = "owner" | "admin" | "member";

export type MemberRow = {
  id: string;
  isCurrentUser: boolean;
  joinedAtLabel: string;
  name: string;
  email: string;
  role: OrgMemberRole;
  roleLabel: string;
  userId: string;
};

export function formatRoleLabel(
  role: OrgMemberRole,
  locale: AppLocale,
): string {
  if (locale === "pt-BR") {
    if (role === "owner") return "Proprietário";
    if (role === "admin") return "Administrador";
    return "Colaborador";
  }
  if (role === "owner") return "Owner";
  if (role === "admin") return "Admin";
  return "Collaborator";
}

export function formatDateLabel(dt: Date, locale: AppLocale): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dt);
}
