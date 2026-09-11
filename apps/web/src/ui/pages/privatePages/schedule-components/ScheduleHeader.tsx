"use client";

import { useTranslations } from "next-intl";
import { FiCalendar, FiPlus } from "react-icons/fi";
import { Button } from "@/ui/base/Button";

export function ScheduleHeader({ onNew }: { onNew: () => void }) {
  const t = useTranslations("schedule");

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-(--color-primary)/20 bg-(--color-primary)/10 px-2.5 py-0.5 text-xs font-semibold text-(--color-primary)">
            <FiCalendar className="text-xs" />
            Operação de Campo
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          {t("pageTitle")}
        </h1>
        <p className="text-sm text-(--color-text-2)">{t("pageSubtitle")}</p>
      </div>

      <Button type="primary" onClick={onNew}>
        <span className="inline-flex items-center gap-2 font-semibold">
          <FiPlus className="text-base" />
          {t("actions.new")}
        </span>
      </Button>
    </header>
  );
}
