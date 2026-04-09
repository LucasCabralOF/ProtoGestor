"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FiGlobe, FiMonitor, FiMoon, FiSun } from "react-icons/fi";
import { useAppStore } from "@/stores/appStore";
import type { LocaleKey, ThemeKey } from "@/types/base";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { setClientCookie } from "@/utils/clientCookies";

const THEME_OPTIONS: {
  description: string;
  icon: React.ReactNode;
  label: string;
  value: ThemeKey;
}[] = [
  {
    description: "Visual claro e limpo para o trabalho do dia a dia.",
    icon: <FiSun />,
    label: "Claro",
    value: "light",
  },
  {
    description: "Contraste mais forte para ambientes de baixa luminosidade.",
    icon: <FiMoon />,
    label: "Escuro",
    value: "dark",
  },
];

const LOCALE_OPTIONS: {
  description: string;
  icon: React.ReactNode;
  label: string;
  value: LocaleKey;
}[] = [
  {
    description: "Interface em Português do Brasil.",
    icon: <FiGlobe />,
    label: "Português (BR)",
    value: "pt-BR",
  },
  {
    description: "Interface em inglês para operação bilíngue.",
    icon: <FiMonitor />,
    label: "English",
    value: "en",
  },
];

export function SettingsPage({
  orgName,
  orgSlug,
  userEmail,
  userName,
}: {
  orgName: string;
  orgSlug: string | null;
  userEmail: string | null;
  userName: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const appSettings = useAppStore((s) => s.appSettings);
  const setTheme = useAppStore((s) => s.setTheme);
  const setLocale = useAppStore((s) => s.setLocale);

  async function applyTheme(theme: ThemeKey) {
    if (theme === appSettings.theme) return;

    setTheme(theme);
    await setClientCookie("APP_THEME", theme);
    startTransition(() => router.refresh());
  }

  async function applyLocale(locale: LocaleKey) {
    if (locale === appSettings.locale) return;

    setLocale(locale);
    await setClientCookie("NEXT_LOCALE", locale);
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight">Configurações</h1>
        <p className="text-(--color-text-2)">
          Ajuste preferências do painel, revise sua conta e confira o contexto
          atual da organização.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_0.9fr]">
        <Card className="border border-(--color-border)">
          <h2 className="text-xl font-bold">Preferências da Interface</h2>

          <div className="mt-5 grid gap-5">
            <div>
              <p className="text-sm font-semibold text-(--color-text-2)">
                Tema atual
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {THEME_OPTIONS.map((option) => {
                  const active = appSettings.theme === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={`min-w-56 rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-(--color-primary) bg-(--color-base-2)"
                          : "border-(--color-border) bg-(--color-base-1) hover:bg-(--color-base-2)"
                      }`}
                      onClick={() => void applyTheme(option.value)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl border border-(--color-border) bg-(--color-base-1) p-3">
                          {option.icon}
                        </div>
                        <div>
                          <p className="font-semibold">{option.label}</p>
                          <p className="mt-1 text-sm text-(--color-text-2)">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-(--color-text-2)">
                Idioma do sistema
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {LOCALE_OPTIONS.map((option) => {
                  const active = appSettings.locale === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={`min-w-56 rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-(--color-primary) bg-(--color-base-2)"
                          : "border-(--color-border) bg-(--color-base-1) hover:bg-(--color-base-2)"
                      }`}
                      onClick={() => void applyLocale(option.value)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl border border-(--color-border) bg-(--color-base-1) p-3">
                          {option.icon}
                        </div>
                        <div>
                          <p className="font-semibold">{option.label}</p>
                          <p className="mt-1 text-sm text-(--color-text-2)">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          <Card className="border border-(--color-border)">
            <h2 className="text-xl font-bold">Conta</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4">
                <p className="text-(--color-text-2)">Usuário</p>
                <p className="mt-1 font-semibold">{userName}</p>
              </div>

              <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4">
                <p className="text-(--color-text-2)">E-mail</p>
                <p className="mt-1 font-semibold">
                  {userEmail ?? "Não informado"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border border-(--color-border)">
            <h2 className="text-xl font-bold">Organização Atual</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4">
                <p className="text-(--color-text-2)">Nome</p>
                <p className="mt-1 font-semibold">{orgName}</p>
              </div>

              <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4">
                <p className="text-(--color-text-2)">Slug</p>
                <p className="mt-1 font-semibold">
                  {orgSlug ?? "Ainda não definido"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border border-(--color-border)">
            <h2 className="text-xl font-bold">Estado Atual</h2>
            <p className="mt-4 text-sm text-(--color-text-2)">
              Preferências salvas em cookie para o server refletir o tema e o
              idioma nos componentes renderizados no servidor.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button fit disabled={isPending} type="default">
                Tema: {appSettings.theme === "dark" ? "Escuro" : "Claro"}
              </Button>
              <Button fit disabled={isPending} type="default">
                Idioma: {appSettings.locale}
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
