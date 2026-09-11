"use client";

import { useTranslations } from "next-intl";
import { FiFilter, FiSearch, FiUser } from "react-icons/fi";
import { Input } from "@/ui/base/Input";

type ServicesFiltersProps = {
  customerId: string;
  customerOptions: Array<{ id: string; name: string }>;
  onParamChange: (key: string, value: string) => void;
  q: string;
  status: string;
};

export function ServicesFilters({
  customerId,
  customerOptions,
  onParamChange,
  q,
  status,
}: ServicesFiltersProps) {
  const t = useTranslations("services");

  return (
    <section className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative w-full flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-2)">
          <FiSearch className="h-4 w-4" />
        </span>

        <Input
          testid="services-search"
          className="w-full pl-9"
          placeholder={t("filters.searchPlaceholder")}
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
            data-testid="select-services-status"
            value={status}
            onChange={(e) => onParamChange("status", e.target.value)}
            className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-base-1) pl-8 pr-8 text-sm font-medium text-(--color-text) transition-colors focus:border-(--color-primary) focus:outline-none sm:w-auto"
          >
            <option value="all">{t("filters.allStatuses")}</option>
            <option value="draft">{t("filters.draft")}</option>
            <option value="scheduled">{t("filters.scheduled")}</option>
            <option value="in_progress">{t("filters.inProgress")}</option>
            <option value="completed">{t("filters.completed")}</option>
            <option value="canceled">{t("filters.canceled")}</option>
          </select>
        </div>

        <div className="relative flex-1 sm:flex-initial">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-2)">
            <FiUser className="h-3.5 w-3.5" />
          </span>
          <select
            data-testid="select-services-customer"
            value={customerId}
            onChange={(e) => onParamChange("customerId", e.target.value)}
            className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-base-1) pl-8 pr-8 text-sm font-medium text-(--color-text) transition-colors focus:border-(--color-primary) focus:outline-none sm:w-auto"
          >
            <option value="">{t("filters.allCustomers")}</option>
            {customerOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
