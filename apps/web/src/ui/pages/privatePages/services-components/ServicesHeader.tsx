"use client";

import { useTranslations } from "next-intl";
import { FiBriefcase, FiPlus } from "react-icons/fi";
import { Button } from "@/ui/base/Button";

type ServicesHeaderProps = {
  onNew: () => void;
};

export function ServicesHeader({ onNew }: ServicesHeaderProps) {
  const t = useTranslations("services");

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-500 border border-sky-500/20">
          <FiBriefcase className="h-3.5 w-3.5" />
          <span>Ordens e Atendimentos</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight lg:text-4xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-1 text-sm text-(--color-text-2)">
          {t("pageSubtitle")}
        </p>
      </div>

      <div className="flex gap-2">
        <Button testid="services-add" type="primary" onClick={onNew}>
          <span className="inline-flex items-center gap-2">
            <FiPlus />
            {t("actions.new")}
          </span>
        </Button>
      </div>
    </header>
  );
}
