"use client";

import { FiCheck } from "react-icons/fi";

export function StepIndicator({
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
