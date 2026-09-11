"use client";

import { useTranslations } from "next-intl";
import { FiCalendar, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import type { ScheduleKpis as ScheduleKpisType } from "@/lib/schedule";
import { Card } from "@/ui/base/Card";

export function ScheduleKpis({ kpis }: { kpis: ScheduleKpisType }) {
  const t = useTranslations("schedule");

  const cards = [
    {
      label: t("kpis.today"),
      value: kpis.today,
      hint: t("kpis.todayHint"),
      icon: <FiClock className="text-sky-500 text-lg" />,
      iconBg: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    },
    {
      label: t("kpis.scheduled"),
      value: kpis.scheduled,
      hint: t("kpis.scheduledHint"),
      icon: <FiCalendar className="text-blue-500 text-lg" />,
      iconBg: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
    {
      label: t("kpis.done"),
      value: kpis.done,
      hint: t("kpis.doneHint"),
      icon: <FiCheckCircle className="text-emerald-500 text-lg" />,
      iconBg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    {
      label: t("kpis.canceled"),
      value: kpis.canceled,
      hint: t("kpis.canceledHint"),
      icon: <FiXCircle className="text-rose-500 text-lg" />,
      iconBg: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((c) => (
        <Card
          key={c.label}
          className="border border-(--color-border) bg-(--color-base-1) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-(--color-text-2)">
                {c.label}
              </p>
              <p className="mt-2 text-3xl font-black tracking-tight">
                {c.value}
              </p>
              <p className="mt-1 text-xs text-(--color-text-2)">{c.hint}</p>
            </div>
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${c.iconBg}`}
            >
              {c.icon}
            </div>
          </div>
        </Card>
      ))}
    </section>
  );
}
