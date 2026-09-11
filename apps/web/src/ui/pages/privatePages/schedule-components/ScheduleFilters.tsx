"use client";

import { useTranslations } from "next-intl";
import { FiFilter, FiSearch, FiUser } from "react-icons/fi";
import { Input } from "@/ui/base/Input";

export function ScheduleFilters({
  q,
  status,
  customerId,
  customerOptions,
  onParamChange,
}: {
  q: string;
  status: string;
  customerId: string;
  customerOptions: { id: string; name: string }[];
  onParamChange: (key: string, value: string) => void;
}) {
  const t = useTranslations("schedule");

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-(--color-border) bg-(--color-base-1) p-3 shadow-xs lg:flex-row lg:items-center">
      {/* Busca */}
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-text-2)">
          <FiSearch className="text-base" />
        </span>
        <Input
          className="w-full pl-10"
          placeholder={t("filters.searchPlaceholder")}
          value={q}
          onChange={(e) => onParamChange("q", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        {/* Status */}
        <div className="relative flex items-center">
          <span className="pointer-events-none absolute left-3 text-(--color-text-2)">
            <FiFilter className="text-sm" />
          </span>
          <select
            value={status}
            onChange={(e) => onParamChange("status", e.target.value)}
            className="h-10 w-full appearance-none rounded-xl border border-(--color-border) bg-(--color-base-2) pl-9 pr-8 text-sm font-medium transition-colors hover:border-(--color-primary) focus:border-(--color-primary) focus:outline-hidden"
          >
            <option value="all">{t("filters.allStatuses")}</option>
            <option value="scheduled">{t("filters.scheduled")}</option>
            <option value="done">{t("filters.done")}</option>
            <option value="canceled">{t("filters.canceled")}</option>
          </select>
        </div>

        {/* Cliente */}
        <div className="relative flex items-center">
          <span className="pointer-events-none absolute left-3 text-(--color-text-2)">
            <FiUser className="text-sm" />
          </span>
          <select
            value={customerId}
            onChange={(e) => onParamChange("customerId", e.target.value)}
            className="h-10 w-full appearance-none rounded-xl border border-(--color-border) bg-(--color-base-2) pl-9 pr-8 text-sm font-medium transition-colors hover:border-(--color-primary) focus:border-(--color-primary) focus:outline-hidden"
          >
            <option value="">{t("filters.allCustomers")}</option>
            {customerOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
