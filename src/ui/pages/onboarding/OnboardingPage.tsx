"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiCheckCircle,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { createOrganizationAction } from "@/actions/onboardingActions";
import { slugifyOrganizationName } from "@/lib/org-slug";
import { Alert } from "@/ui/base/Alert";
import { Button } from "@/ui/base/Button";
import { Form } from "@/ui/base/Form";
import { Input } from "@/ui/base/Input";
import {
  ONBOARDING_CLIENT_COUNT_IDS,
  ONBOARDING_SEGMENT_IDS,
  ONBOARDING_TOOL_IDS,
  type OnboardingStep1Data,
  type OnboardingStep2Data,
  validateStep1,
  validateStep2,
} from "./onboarding-utils";

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
// Step Indicator
// ---------------------------------------------------------------------------

function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={
              step < current
                ? "flex h-7 w-7 items-center justify-center rounded-full bg-(--color-primary) text-xs font-bold text-white"
                : step === current
                  ? "flex h-7 w-7 items-center justify-center rounded-full border-2 border-(--color-primary) text-xs font-bold text-(--color-primary)"
                  : "flex h-7 w-7 items-center justify-center rounded-full border border-(--color-border) text-xs text-(--color-text-2)"
            }
          >
            {step < current ? <FiCheck size={12} /> : step}
          </div>
          {step < total ? (
            <div
              className={
                step < current
                  ? "h-px w-8 bg-(--color-primary)"
                  : "h-px w-8 bg-(--color-border)"
              }
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Nome e segmento (client-only; org ainda não é criada aqui)
//
// A criação da org foi movida para o Step 3 para evitar que o cookie
// ACTIVE_ORG_COOKIE seja setado prematuramente. Se settarmos o cookie aqui,
// o Next.js invalida o Router Cache e o servidor re-renderiza /onboarding,
// que detecta a org e redireciona para /dashboard antes do Step 2 ser exibido.
// (ver docs/erros-conhecidos.md ERR-006)
// ---------------------------------------------------------------------------

function Step1Form({
  initial,
  userEmail,
  onNext,
}: {
  initial: Partial<OnboardingStep1Data>;
  userEmail: string | null;
  onNext: (name: string, segment: string) => void;
}) {
  const t = useTranslations("onboarding");

  // `name` é gerenciado pelo Form do AntD para validação nativa
  const [form] = Form.useForm<{ name: string }>();
  const nameValue = Form.useWatch("name", form) ?? initial.name ?? "";

  // `segment` é estado local para evitar conflito de `defaultValue` em
  // campo nativo `<select>` dentro de Form.Item controlado pelo AntD
  const [segment, setSegment] = useState(initial.segment ?? "");
  const [segmentTouched, setSegmentTouched] = useState(false);
  const segmentError = segmentTouched && !segment;

  const slugPreview =
    nameValue.trim().length >= 2
      ? slugifyOrganizationName(nameValue)
      : null;

  async function handleSubmit(values: { name: string }) {
    setSegmentTouched(true);
    const errors = validateStep1({ name: values.name, segment });
    if (errors.length > 0) return;
    onNext(values.name.trim(), segment);
  }

  return (
    <Form<{ name: string }>
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={{ name: initial.name ?? "" }}
      onFinish={handleSubmit}
    >
      {userEmail ? (
        <p className="mb-5 text-sm text-(--color-text-2)">
          {t("step1.signedAs", { email: userEmail })}
        </p>
      ) : null}

      <Form.Item
        name="name"
        label={t("step1.nameLabel")}
        rules={[
          { required: true, message: t("step1.nameRequired") },
          { min: 2, message: t("step1.nameMin") },
        ]}
      >
        <Input
          testid="onboarding-org-name"
          placeholder={t("step1.namePlaceholder")}
        />
      </Form.Item>

      <div className="mb-4 rounded-2xl border border-dashed border-(--color-border) bg-(--color-base-2) p-3 text-sm">
        <p className="font-medium text-(--color-text-2)">
          {t("step1.slugPreviewLabel")}
        </p>
        <p className="mt-1 font-mono text-xs text-(--color-text-2)">
          {slugPreview ?? t("step1.slugPreviewEmpty")}
        </p>
      </div>

      {/* Segmento fora do Form.Item — gerenciado por estado local */}
      <div className="mb-5">
        <label
          htmlFor="onboarding-segment"
          className="mb-1.5 block text-sm font-medium text-(--color-text-1)"
        >
          {t("step1.segmentLabel")}
        </label>
        <select
          id="onboarding-segment"
          data-testid="onboarding-segment"
          value={segment}
          onChange={(e) => {
            setSegment(e.target.value);
            setSegmentTouched(true);
          }}
          className="w-full rounded-lg border border-(--color-border) bg-(--color-base-1) px-3 py-2 text-sm text-(--color-text-1) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
        >
          <option value="" disabled>
            {t("step1.segmentPlaceholder")}
          </option>
          {ONBOARDING_SEGMENT_IDS.map((id) => (
            <option key={id} value={id}>
              {t(`step1.segments.${id}`)}
            </option>
          ))}
        </select>
        {segmentError ? (
          <p className="mt-1 text-xs text-red-500">
            {t("step1.segmentRequired")}
          </p>
        ) : null}
      </div>

      <Button
        testid="onboarding-next-step1"
        type="primary"
        htmlType="submit"
      >
        <span className="inline-flex items-center gap-2">
          {t("steps.next")}
          <FiArrowRight size={14} />
        </span>
      </Button>
    </Form>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Contexto rápido (client-only, não persiste no servidor)
// ---------------------------------------------------------------------------

function Step2Form({
  initial,
  onNext,
  onBack,
}: {
  initial: Partial<OnboardingStep2Data>;
  onNext: (data: OnboardingStep2Data) => void;
  onBack: () => void;
}) {
  const t = useTranslations("onboarding");
  const [clientCount, setClientCount] = useState(initial.clientCount ?? "");
  const [tool, setTool] = useState(initial.tool ?? "");
  const [touched, setTouched] = useState(false);

  const errors = touched ? validateStep2({ clientCount, tool }) : [];

  function handleNext() {
    setTouched(true);
    const errs = validateStep2({ clientCount, tool });
    if (errs.length > 0) return;
    onNext({ clientCount, tool });
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-3 text-sm font-medium text-(--color-text-1)">
          {t("step2.clientCountLabel")}
        </p>
        <div className="flex flex-col gap-2">
          {ONBOARDING_CLIENT_COUNT_IDS.map((id) => (
            <label
              key={id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                clientCount === id
                  ? "border-(--color-primary) bg-blue-50 font-medium dark:bg-blue-950/30"
                  : "border-(--color-border) bg-(--color-base-1) hover:bg-(--color-base-2)"
              }`}
            >
              <input
                type="radio"
                name="clientCount"
                value={id}
                checked={clientCount === id}
                onChange={() => setClientCount(id)}
                className="accent-(--color-primary)"
                data-testid={`onboarding-client-count-${id}`}
              />
              {t(`step2.clientCounts.${id}`)}
            </label>
          ))}
        </div>
        {errors.includes("clientCount") ? (
          <p className="mt-1 text-xs text-red-500">
            {t("step2.clientCountRequired")}
          </p>
        ) : null}
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-(--color-text-1)">
          {t("step2.toolLabel")}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {ONBOARDING_TOOL_IDS.map((id) => (
            <label
              key={id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition ${
                tool === id
                  ? "border-(--color-primary) bg-blue-50 font-medium dark:bg-blue-950/30"
                  : "border-(--color-border) bg-(--color-base-1) hover:bg-(--color-base-2)"
              }`}
            >
              <input
                type="radio"
                name="tool"
                value={id}
                checked={tool === id}
                onChange={() => setTool(id)}
                className="accent-(--color-primary)"
                data-testid={`onboarding-tool-${id}`}
              />
              {t(`step2.tools.${id}`)}
            </label>
          ))}
        </div>
        {errors.includes("tool") ? (
          <p className="mt-1 text-xs text-red-500">
            {t("step2.toolRequired")}
          </p>
        ) : null}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-base-1) px-5 py-2.5 text-sm font-medium text-(--color-text-1) transition hover:bg-(--color-base-2)"
          data-testid="onboarding-back"
        >
          <FiArrowLeft size={14} />
          {t("steps.back")}
        </button>
        <Button testid="onboarding-next-step2" type="primary" onClick={handleNext}>
          <span className="inline-flex items-center gap-2">
            {t("step2.continue")}
            <FiArrowRight size={14} />
          </span>
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Confirmação + criação real da org
//
// A org é criada AQUI, não no Step 1, para evitar que o cookie
// ACTIVE_ORG_COOKIE seja setado antes do usuário completar o wizard.
// Logo após a criação, navegamos para /dashboard — o redirect do servidor
// (caso o Next.js re-renderize /onboarding) não chega a ser perceptível.
// ---------------------------------------------------------------------------

function Step3Confirm({
  orgName,
  onBack,
  onCreated,
}: {
  orgName: string;
  onBack: () => void;
  onCreated: (createdName: string) => void;
}) {
  const t = useTranslations("onboarding");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setError(null);
    setLoading(true);
    try {
      const result = await createOrganizationAction({ name: orgName });
      const r = result as Record<string, unknown> | null | undefined;
      const serverErr =
        typeof r?.serverError === "string" ? r.serverError : null;
      if (serverErr) {
        setError(serverErr);
        return;
      }
      onCreated(orgName);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4 text-sm">
        <p className="font-medium text-(--color-text-2)">
          {t("step3.orgCreated")}
        </p>
        <p className="mt-1 text-base font-bold">{orgName}</p>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-(--color-text-2)">
          {t("step3.nextStepsTitle")}
        </p>
        <div className="flex flex-col gap-2">
          {(["clients", "services", "settings"] as const).map((key, idx) => (
            <div
              key={key}
              className="flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-base-2) px-4 py-3 text-sm"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--color-primary) text-xs font-bold text-white">
                {idx + 1}
              </span>
              {t(`step3.nextSteps.${key}`)}
            </div>
          ))}
        </div>
      </div>

      {error ? (
        <Alert type="error" title={error} testid="onboarding-create-error" />
      ) : null}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-base-1) px-5 py-2.5 text-sm font-medium text-(--color-text-1) transition hover:bg-(--color-base-2) disabled:opacity-50"
          data-testid="onboarding-back-step3"
        >
          <FiArrowLeft size={14} />
          {t("steps.back")}
        </button>
        <Button
          testid="onboarding-go-dashboard"
          type="primary"
          loading={loading}
          onClick={handleCreate}
        >
          <span className="inline-flex items-center gap-2">
            {loading ? t("step1.submitting") : t("step3.cta")}
            <FiArrowRight size={14} />
          </span>
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 Done — exibido brevemente após a criação enquanto navegamos
// ---------------------------------------------------------------------------

function Step3Done({ orgName }: { orgName: string }) {
  const t = useTranslations("onboarding");
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <FiCheckCircle size={40} className="text-emerald-500" />
      <p className="text-xl font-black">{t("step3.title")}</p>
      <p className="text-sm text-(--color-text-2)">{orgName}</p>
    </div>
  );
}

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
      step: (Math.max(1, prev.step - 1) as 1 | 2 | 3),
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
