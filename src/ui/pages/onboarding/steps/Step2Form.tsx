"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { Button } from "@/ui/base/Button";
import {
  ONBOARDING_CLIENT_COUNT_IDS,
  ONBOARDING_TOOL_IDS,
  type OnboardingStep2Data,
  validateStep2,
} from "../onboarding-utils";

export function Step2Form({
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
          <p className="mt-1 text-xs text-red-500">{t("step2.toolRequired")}</p>
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
        <Button
          testid="onboarding-next-step2"
          type="primary"
          onClick={handleNext}
        >
          <span className="inline-flex items-center gap-2">
            {t("step2.continue")}
            <FiArrowRight size={14} />
          </span>
        </Button>
      </div>
    </div>
  );
}
