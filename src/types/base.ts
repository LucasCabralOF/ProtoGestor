export type ThemeKey = "light" | "dark";

export type LocaleKey = "pt-BR" | "en";

export type OrgRoleKey = "owner" | "admin" | "member";

export type AppSettings = {
  theme: ThemeKey;
  locale: LocaleKey;
};

export type OrganizationSummary = {
  id: string;
  name: string;
  slug: string | null;
  role: OrgRoleKey;
};

export type User = {
  id: string;
  name: string;
  email?: string | null;
  role?: "admin" | "user";
};
