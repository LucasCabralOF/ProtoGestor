export type ThemeKey = "light" | "dark";

export type LocaleKey = "pt-BR" | "en";

export type AppSettings = {
  theme: ThemeKey;
  locale: LocaleKey;
};

export type User = {
  id: string;
  name: string;
  email?: string | null;
  role?: "admin" | "user";
};
