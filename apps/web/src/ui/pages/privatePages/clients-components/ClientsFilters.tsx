"use client";

import { useTranslations } from "next-intl";
import { FiFilter, FiRepeat, FiSearch } from "react-icons/fi";
import { Input } from "@/ui/base/Input";

type ClientsFiltersProps = {
  onParamChange: (key: string, value: string) => void;
  q: string;
  recurring: string;
  status: string;
};

export function ClientsFilters({
  onParamChange,
  q,
  recurring,
  status,
}: ClientsFiltersProps) {
  const t = useTranslations("clients");

  const filteredStatusValue =
    status === "active" || status === "inactive" ? status : "all";
  const recurringValue = recurring === "yes" ? "yes" : "all";

  return (
    <section className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative w-full flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-2)">
          <FiSearch className="h-4 w-4" />
        </span>

        <Input
          testid="clients-search"
          placeholder={t("filters.searchPlaceholder")}
          className="w-full pl-9"
          value={q}
          onChange={(e) => onParamChange("q", e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2.5 sm:flex-nowrap">
        <div className="relative flex-1 sm:flex-initial">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-2)">
            <FiFilter className="h-3.5 w-3.5" />
          </span>
          <select
            data-testid="select-clients-status"
            value={filteredStatusValue}
            onChange={(e) => onParamChange("status", e.target.value)}
            className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-base-1) pl-8 pr-8 text-sm font-medium text-(--color-text) transition-colors focus:border-(--color-primary) focus:outline-none sm:w-auto"
          >
            <option value="all">{t("filters.all")}</option>
            <option value="active">{t("filters.active")}</option>
            <option value="inactive">{t("filters.inactive")}</option>
          </select>
        </div>

        <div className="relative flex-1 sm:flex-initial">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-2)">
            <FiRepeat className="h-3.5 w-3.5" />
          </span>
          <select
            data-testid="select-clients-recurring"
            value={recurringValue}
            onChange={(e) => onParamChange("recurring", e.target.value)}
            className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-base-1) pl-8 pr-8 text-sm font-medium text-(--color-text) transition-colors focus:border-(--color-primary) focus:outline-none sm:w-auto"
          >
            <option value="all">{t("filters.all")}</option>
            <option value="yes">{t("filters.recurring")}</option>
          </select>
        </div>
      </div>
    </section>
  );
}
