"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { createOrganizationAction } from "@/actions/onboardingActions";
import { Alert } from "@/ui/base/Alert";
import { Button } from "@/ui/base/Button";

export function Step3Confirm({
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

export function Step3Done({ orgName }: { orgName: string }) {
  const t = useTranslations("onboarding");
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <FiCheckCircle size={40} className="text-emerald-500" />
      <p className="text-xl font-black">{t("step3.title")}</p>
      <p className="text-sm text-(--color-text-2)">{orgName}</p>
    </div>
  );
}
