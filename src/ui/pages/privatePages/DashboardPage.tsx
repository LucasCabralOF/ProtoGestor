"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import type { DashboardData } from "@/lib/dashboard";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { OnboardingChecklist } from "./OnboardingChecklist";

export function DashboardPage({
  userName,
  data,
  hasClients,
  hasServices,
}: {
  userName: string;
  data: DashboardData;
  /** Conta tem pelo menos 1 cliente ativo — usado para o checklist de ativação */
  hasClients: boolean;
  /** Conta tem pelo menos 1 ordem de serviço — usado para o checklist de ativação */
  hasServices: boolean;
}) {
  const t = useTranslations("dashboard");
  const { kpis } = data;

  return (
    <div className="flex flex-col gap-6">
      <OnboardingChecklist hasClients={hasClients} hasServices={hasServices} />
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight">
          {t("title", { userName })}
        </h1>
        <p className="text-(--color-text-2)">{t("subtitle")}</p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border border-(--color-border)">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-(--color-text-2)">
                {t("monthlyRevenue")}
              </p>
              <p className="mt-1 text-3xl font-extrabold">
                {kpis.monthlyRevenueLabel}
              </p>
              <p className="mt-2 text-sm text-emerald-500">
                {t("vsLastMonth", {
                  prefix: kpis.monthlyRevenueDeltaPct >= 0 ? "+" : "",
                  value: kpis.monthlyRevenueDeltaPct,
                })}
              </p>
            </div>
            <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-3">
              <FiDollarSign className="text-xl" />
            </div>
          </div>
        </Card>

        <Card className="border border-(--color-border)">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-(--color-text-2)">
                {t("activeClients")}
              </p>
              <p className="mt-1 text-3xl font-extrabold">
                {kpis.activeClients}
              </p>
              <p className="mt-2 text-sm text-emerald-500">
                {t("newClientsThisMonth", { value: kpis.newClientsThisMonth })}
              </p>
            </div>
            <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-3">
              <FiUsers className="text-xl" />
            </div>
          </div>
        </Card>

        <Card className="border border-(--color-border)">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-(--color-text-2)">
                {t("servicesThisWeek")}
              </p>
              <p className="mt-1 text-3xl font-extrabold">
                {kpis.servicesThisWeek}
              </p>
              <p className="mt-2 text-sm text-(--color-text-2)">
                {t("servicesWeekSummary", {
                  completed: kpis.servicesCompletedThisWeek,
                  pending: Math.max(
                    0,
                    kpis.servicesThisWeek - kpis.servicesCompletedThisWeek,
                  ),
                })}
              </p>
            </div>
            <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-3">
              <FiCalendar className="text-xl" />
            </div>
          </div>
        </Card>

        <Card className="border border-(--color-border)">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-(--color-text-2)">{t("growthRate")}</p>
              <p className="mt-1 text-3xl font-extrabold">
                {kpis.monthlyRevenueDeltaPct}%
              </p>
              <p className="mt-2 text-sm text-emerald-500">
                {t("vsLastMonth", {
                  prefix: kpis.monthlyRevenueDeltaPct >= 0 ? "+" : "",
                  value: kpis.monthlyRevenueDeltaPct,
                })}
              </p>
            </div>
            <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-3">
              <FiTrendingUp className="text-xl" />
            </div>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="border border-(--color-border)">
          <h2 className="text-xl font-bold">{t("recentActivity")}</h2>
          <div className="mt-4">
            {data.recentActivity.length === 0 ? (
              <p className="py-10 text-center text-(--color-text-2)">
                {t("noRecentActivity")}
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {data.recentActivity.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-xl border border-(--color-border) bg-(--color-base-2) p-3"
                  >
                    <p className="text-sm">{a.message}</p>
                    <p className="mt-1 text-xs text-(--color-text-2)">
                      {a.createdAtLabel}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card className="border border-(--color-border)">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">{t("upcomingServices")}</h2>
            <Link href="/services">
              <Button fit type="default">
                {t("viewAll")}
              </Button>
            </Link>
          </div>

          <div className="mt-4">
            {data.upcomingServices.length === 0 ? (
              <p className="py-10 text-center text-(--color-text-2)">
                {t("noUpcomingServices")}
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {data.upcomingServices.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-xl border border-(--color-border) bg-(--color-base-2) p-3"
                  >
                    <p className="font-semibold">{s.title}</p>
                    <p className="mt-1 text-sm text-(--color-text-2)">
                      {s.customerName ? `${s.customerName} • ` : ""}
                      {s.startsAtLabel}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
