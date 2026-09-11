"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useTransition } from "react";
import { FiGlobe, FiMonitor, FiMoon, FiSliders, FiSun } from "react-icons/fi";
import type { MemberRow, OrgMemberRole } from "@/lib/members";
import { useAppStore } from "@/stores/appStore";
import type { LocaleKey, OrganizationSummary, ThemeKey } from "@/types/base";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { setClientCookie } from "@/utils/clientCookies";
import { SettingsCompanies } from "./settings-components/SettingsCompanies";
import { SettingsMembers } from "./settings-components/SettingsMembers";
import { SettingsSubscription } from "./settings-components/SettingsSubscription";

type SettingsPageProps = {
  activeOrgId?: string;
  activePlan?: string | null;
  currentRole?: OrgMemberRole;
  members?: MemberRow[];
  orgName: string;
  orgSlug: string | null;
  organizations?: OrganizationSummary[];
  trialEndsAtIso?: string | null;
  userEmail: string | null;
  userName: string;
};

export function SettingsPage({
  activeOrgId,
  activePlan,
  currentRole = "owner",
  members = [],
  orgName,
  orgSlug,
  organizations = [],
  trialEndsAtIso,
  userEmail,
  userName,
}: SettingsPageProps) {
  const router = useRouter();
  const t = useTranslations("settings");
  const [isPending, startTransition] = useTransition();

  const appSettings = useAppStore((s) => s.appSettings);
  const setTheme = useAppStore((s) => s.setTheme);
  const setLocale = useAppStore((s) => s.setLocale);

  const themeOptions: {
    description: string;
    icon: ReactNode;
    label: string;
    value: ThemeKey;
  }[] = [
    {
      description: t("themeLightDescription"),
      icon: <FiSun />,
      label: t("themeLightLabel"),
      value: "light",
    },
    {
      description: t("themeDarkDescription"),
      icon: <FiMoon />,
      label: t("themeDarkLabel"),
      value: "dark",
    },
  ];

  const localeOptions: {
    description: string;
    icon: ReactNode;
    label: string;
    value: LocaleKey;
  }[] = [
    {
      description: t("localePtBRDescription"),
      icon: <FiGlobe />,
      label: t("localePtBRLabel"),
      value: "pt-BR",
    },
    {
      description: t("localeEnDescription"),
      icon: <FiMonitor />,
      label: t("localeEnLabel"),
      value: "en",
    },
  ];

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
      <header className="flex flex-col gap-1">
        <div className="mb-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500 border border-blue-500/20">
          <FiSliders className="h-3.5 w-3.5" />
          <span>Configurações da Plataforma</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight lg:text-4xl">
          {t("title")}
        </h1>
        <p className="text-sm text-(--color-text-2)">{t("subtitle")}</p>
      </header>

      {/* Multi-Empresas */}
      {organizations.length > 0 && activeOrgId && (
        <SettingsCompanies
          activeOrgId={activeOrgId}
          organizations={organizations}
        />
      )}

      {/* Plano & Assinatura da Plataforma SaaS (Fase 6) */}
      <SettingsSubscription
        activePlan={activePlan}
        currentRole={currentRole}
        orgName={orgName}
        trialEndsAtIso={trialEndsAtIso}
      />

      {/* Equipe e Colaboradores */}
      <SettingsMembers
        currentRole={currentRole}
        members={members}
        orgName={orgName}
        orgSlug={orgSlug}
      />

      {/* Interface e Conta */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_0.9fr]">
        <Card className="border border-(--color-border)">
          <h2 className="text-xl font-bold">{t("interfaceTitle")}</h2>

          <div className="mt-5 grid gap-5">
            <div>
              <p className="text-sm font-semibold text-(--color-text-2)">
                {t("currentTheme")}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {themeOptions.map((option) => {
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
                {t("currentLanguage")}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {localeOptions.map((option) => {
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
            <h2 className="text-xl font-bold">{t("accountTitle")}</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4">
                <p className="text-(--color-text-2)">{t("userLabel")}</p>
                <p className="mt-1 font-semibold">{userName}</p>
              </div>

              <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4">
                <p className="text-(--color-text-2)">{t("emailLabel")}</p>
                <p className="mt-1 font-semibold">
                  {userEmail ?? t("emailUnknown")}
                </p>
              </div>

              <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4">
                <p className="text-(--color-text-2)">Papel na Empresa Ativa</p>
                <p className="mt-1 font-semibold text-blue-500 capitalize">
                  {currentRole === "owner"
                    ? "Proprietário (Dono)"
                    : currentRole === "admin"
                      ? "Administrador"
                      : "Colaborador"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border border-(--color-border)">
            <h2 className="text-xl font-bold">{t("stateTitle")}</h2>
            <p className="mt-4 text-sm text-(--color-text-2)">
              {t("stateDescription")}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button fit disabled={isPending} type="default">
                {t("themeChip", {
                  theme:
                    appSettings.theme === "dark"
                      ? t("themeDarkChip")
                      : t("themeLightChip"),
                })}
              </Button>
              <Button fit disabled={isPending} type="default">
                {t("languageChip", { locale: appSettings.locale })}
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
