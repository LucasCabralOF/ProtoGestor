"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiBriefcase, FiUsers, FiZap } from "react-icons/fi";
import type {
  OnboardingStep1Data,
  OnboardingStep2Data,
} from "./onboarding-utils";
import { Step1Form } from "./steps/Step1Form";
import { Step2Form } from "./steps/Step2Form";
import { Step3Confirm, Step3Done } from "./steps/Step3Confirm";
import { StepIndicator } from "./steps/StepIndicator";

// ---------------------------------------------------------------------------
// Tipos do wizard
// ---------------------------------------------------------------------------

const TOTAL_STEPS = 3;

type WizardState = {
  step: 1 | 2 | 3;
  step1: Partial<OnboardingStep1Data>;
  step2: Partial<OnboardingStep2Data>;
};

// ---------------------------------------------------------------------------
// Componente principal — OnboardingPage
// ---------------------------------------------------------------------------

export function OnboardingPage({
  userEmail,
  userName,
}: {
  userEmail: string | null;
  userName: string;
}) {
  const t = useTranslations("onboarding");
  const router = useRouter();

  const [wizard, setWizard] = useState<WizardState>({
    step: 1,
    step1: {},
    step2: {},
  });
  const [createdOrgName, setCreatedOrgName] = useState("");

  function handleStep1Next(name: string, segment: string) {
    setWizard((prev) => ({
      ...prev,
      step: 2,
      step1: { name, segment },
    }));
  }

  function handleStep2Next(data: OnboardingStep2Data) {
    setWizard((prev) => ({ ...prev, step: 3, step2: data }));
  }

  function handleBack() {
    setWizard((prev) => ({
      ...prev,
      step: Math.max(1, prev.step - 1) as 1 | 2 | 3,
    }));
  }

  function handleCreated(orgName: string) {
    setCreatedOrgName(orgName);
    // Navega imediatamente — o servidor re-renderizará /onboarding com a
    // org já existente e redirecionaria para /dashboard, mas estamos chegando
    // lá primeiro via router.replace
    router.replace("/dashboard");
    router.refresh();
  }

  const stepTitles = {
    1: t("step1.title"),
    2: t("step2.title"),
    3: t("step3.title"),
  } as const;

  const stepSubtitles = {
    1: t("step1.subtitle"),
    2: t("step2.subtitle"),
    3: t("step3.subtitle"),
  } as const;

  const stepEyebrows = {
    1: t("step1.eyebrow"),
    2: t("step2.eyebrow"),
    3: t("step3.eyebrow"),
  } as const;

  return (
    <div className="min-h-screen w-full bg-(--color-base-3) text-(--color-text-1)">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10">
        <div className="grid w-full gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Coluna esquerda — contexto */}
          <section className="flex flex-col justify-center gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-(--color-border) bg-(--color-base-1) px-4 py-2 text-sm text-(--color-text-2)">
              <FiBriefcase size={14} />
              {t("badge")}
            </div>

            <div className="max-w-xl">
              <h1 className="text-4xl font-black tracking-tight text-balance md:text-5xl">
                {t("title", { userName })}
              </h1>
              <p className="mt-4 text-lg text-(--color-text-2)">
                {t("subtitle")}
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-3xl border border-(--color-border) bg-(--color-base-1) p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-3">
                    <FiUsers size={16} />
                  </div>
                  <div>
                    <p className="font-semibold">{t("benefits.ownerTitle")}</p>
                    <p className="mt-1 text-sm text-(--color-text-2)">
                      {t("benefits.ownerDescription")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-(--color-border) bg-(--color-base-1) p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-3">
                    <FiZap size={16} />
                  </div>
                  <div>
                    <p className="font-semibold">{t("benefits.tenantTitle")}</p>
                    <p className="mt-1 text-sm text-(--color-text-2)">
                      {t("benefits.tenantDescription")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Coluna direita — wizard */}
          <section>
            <div
              className="rounded-3xl border border-(--color-border) bg-(--color-base-1) p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
              data-testid="onboarding-card"
            >
              <div className="mb-6 flex items-center justify-between">
                <StepIndicator current={wizard.step} total={TOTAL_STEPS} />
                <span className="text-xs text-(--color-text-2)">
                  {t("steps.indicator", {
                    current: wizard.step,
                    total: TOTAL_STEPS,
                  })}
                </span>
              </div>

              {createdOrgName ? (
                <Step3Done orgName={createdOrgName} />
              ) : (
                <>
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-(--color-text-2)">
                      {stepEyebrows[wizard.step]}
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight">
                      {stepTitles[wizard.step]}
                    </h2>
                    <p className="mt-1 text-sm text-(--color-text-2)">
                      {stepSubtitles[wizard.step]}
                    </p>
                  </div>

                  {wizard.step === 1 ? (
                    <Step1Form
                      initial={wizard.step1}
                      userEmail={userEmail}
                      onNext={handleStep1Next}
                    />
                  ) : wizard.step === 2 ? (
                    <Step2Form
                      initial={wizard.step2}
                      onNext={handleStep2Next}
                      onBack={handleBack}
                    />
                  ) : (
                    <Step3Confirm
                      orgName={wizard.step1.name ?? ""}
                      onBack={handleBack}
                      onCreated={handleCreated}
                    />
                  )}
                </>
              )}
            </div>

            <div className="mt-4 text-center text-xs text-(--color-text-2)">
              Já tem uma conta?{" "}
              <Link href="/login" className="underline">
                Entrar
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
