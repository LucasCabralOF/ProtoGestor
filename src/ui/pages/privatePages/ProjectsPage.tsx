import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import {
  FiActivity,
  FiArrowRight,
  FiBriefcase,
  FiClock,
  FiFilter,
  FiFolder,
  FiLayers,
  FiSearch,
  FiSettings,
  FiTarget,
  FiUsers,
} from "react-icons/fi";
import type { ProjectRow, ProjectsPageData } from "@/lib/projects";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";

function toneClass(tone: ProjectRow["statusTone"]) {
  const base =
    "inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold";

  if (tone === "success") {
    return `${base} border-emerald-500/20 bg-emerald-500/10 text-emerald-400`;
  }

  if (tone === "warning") {
    return `${base} border-amber-500/20 bg-amber-500/10 text-amber-400`;
  }

  if (tone === "danger") {
    return `${base} border-rose-500/20 bg-rose-500/10 text-rose-400`;
  }

  if (tone === "accent") {
    return `${base} border-sky-500/20 bg-sky-500/10 text-sky-400`;
  }

  return `${base} border-(--color-border) bg-(--color-base-2) text-(--color-text-2)`;
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="border border-(--color-border)">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-(--color-text-2)">{label}</p>
          <p className="mt-2 text-3xl font-extrabold">{value}</p>
        </div>

        <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-3 text-lg">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function ProjectsPage({
  data,
  filters,
  orgName,
  userName,
}: {
  data: ProjectsPageData;
  filters: {
    q: string;
    stage:
      | "all"
      | "scoping"
      | "planned"
      | "execution"
      | "delivery"
      | "archived";
  };
  orgName: string;
  userName: string;
}) {
  const t = useTranslations("projects");
  const shortcuts = [
    {
      description: t("shortcuts.clientsDescription"),
      href: "/clients",
      icon: <FiUsers />,
      label: t("shortcuts.clientsLabel"),
    },
    {
      description: t("shortcuts.servicesDescription"),
      href: "/services",
      icon: <FiBriefcase />,
      label: t("shortcuts.servicesLabel"),
    },
    {
      description: t("shortcuts.dashboardDescription"),
      href: "/dashboard",
      icon: <FiArrowRight />,
      label: t("shortcuts.dashboardLabel"),
    },
    {
      description: t("shortcuts.settingsDescription"),
      href: "/settings",
      icon: <FiSettings />,
      label: t("shortcuts.settingsLabel"),
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-black tracking-tight">
            {t("pageTitle")}
          </h1>
          <p className="mt-1 text-(--color-text-2)">
            {t("pageSubtitle", { userName, orgName })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/services">
            <Button fit type="primary">
              {t("actions.openServices")}
            </Button>
          </Link>

          <Link href="/clients">
            <Button fit type="default">
              {t("actions.viewClients")}
            </Button>
          </Link>
        </div>
      </header>

      <Card className="border border-(--color-border)">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
              <FiClock />
              {t("hero.badge")}
            </div>

            <h2 className="mt-4 text-2xl font-extrabold">{t("hero.title")}</h2>
            <p className="mt-2 text-(--color-text-2)">
              {t("hero.description")}
            </p>
          </div>

          <div className="rounded-3xl border border-(--color-border) bg-(--color-base-2) p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-(--color-border) bg-(--color-base-1) p-3">
                <FiFolder className="text-2xl" />
              </div>
              <div>
                <p className="text-sm text-(--color-text-2)">
                  {t("hero.activeProjects")}
                </p>
                <p className="text-lg font-bold">{data.kpis.active}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          icon={<FiLayers />}
          label={t("kpis.tenantProjects")}
          value={data.kpis.total}
        />
        <SummaryCard
          icon={<FiActivity />}
          label={t("kpis.inProgress")}
          value={data.kpis.active}
        />
        <SummaryCard
          icon={<FiTarget />}
          label={t("kpis.completed")}
          value={data.kpis.completed}
        />
        <SummaryCard
          icon={<FiClock />}
          label={t("kpis.upcomingVisits")}
          value={data.kpis.upcomingVisits}
        />
        <SummaryCard
          icon={<FiUsers />}
          label={t("kpis.servedClients")}
          value={data.kpis.customerCount}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="border border-(--color-border)">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-bold">Pipeline do módulo</h2>
              <p className="text-sm text-(--color-text-2)">
                {t("pipeline.projectedRevenue", {
                  value: data.kpis.projectedRevenueLabel,
                })}
              </p>
            </div>

            <form
              className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_180px_auto]"
              method="get"
            >
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-(--color-text-2)">
                  {t("pipeline.search")}
                </span>
                <div className="flex items-center gap-2 rounded-2xl border border-(--color-border) bg-(--color-base-2) px-3 py-2">
                  <FiSearch className="shrink-0 text-(--color-text-2)" />
                  <input
                    className="w-full bg-transparent text-sm outline-none placeholder:text-(--color-text-2)"
                    defaultValue={filters.q}
                    name="q"
                    placeholder={t("pipeline.searchPlaceholder")}
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1 text-sm">
                <span className="text-(--color-text-2)">
                  {t("pipeline.stage")}
                </span>
                <div className="flex items-center gap-2 rounded-2xl border border-(--color-border) bg-(--color-base-2) px-3 py-2">
                  <FiFilter className="shrink-0 text-(--color-text-2)" />
                  <select
                    className="w-full bg-transparent text-sm outline-none"
                    defaultValue={filters.stage}
                    name="stage"
                  >
                    <option value="all">{t("pipeline.all")}</option>
                    <option value="scoping">{t("pipeline.scoping")}</option>
                    <option value="planned">{t("pipeline.planned")}</option>
                    <option value="execution">{t("pipeline.execution")}</option>
                    <option value="delivery">{t("pipeline.delivery")}</option>
                    <option value="archived">{t("pipeline.archived")}</option>
                  </select>
                </div>
              </label>

              <div className="flex gap-2">
                <Button fit htmlType="submit" type="primary">
                  {t("actions.filter")}
                </Button>
                <Link href="/projects">
                  <Button fit type="default">
                    {t("actions.clear")}
                  </Button>
                </Link>
              </div>
            </form>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2 2xl:grid-cols-5">
            {data.lanes.map((lane) => (
              <div
                key={lane.stage}
                className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{lane.label}</p>
                    <p className="mt-1 text-sm text-(--color-text-2)">
                      {lane.description}
                    </p>
                  </div>
                  <div className="rounded-full border border-(--color-border) bg-(--color-base-1) px-3 py-1 text-sm font-bold">
                    {lane.count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border border-(--color-border)">
          <h2 className="text-xl font-bold">{t("shortcuts.title")}</h2>
          <div className="mt-4 grid gap-3">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.href}
                className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-(--color-border) bg-(--color-base-1) p-3">
                    {shortcut.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold">{shortcut.label}</p>
                    <p className="mt-1 text-sm text-(--color-text-2)">
                      {shortcut.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link href={shortcut.href}>
                    <Button fit type="default">
                      {t("actions.open", { label: shortcut.label })}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="border border-(--color-border)">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">
                {t("currentProjects.title")}
              </h2>
              <p className="text-sm text-(--color-text-2)">
                {t("currentProjects.subtitle")}
              </p>
            </div>
            <Link href="/services">
              <Button fit type="default">
                {t("actions.manageInServices")}
              </Button>
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {data.rows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-(--color-border) bg-(--color-base-2) p-6 text-sm text-(--color-text-2)">
                {t("currentProjects.empty")}
              </div>
            ) : (
              data.rows.map((row) => (
                <div
                  key={row.id}
                  className="rounded-3xl border border-(--color-border) bg-(--color-base-2) p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold">{row.title}</h3>
                        <span className={toneClass(row.statusTone)}>
                          {row.statusLabel}
                        </span>
                        <span className="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-base-1) px-2 py-1 text-xs font-semibold text-(--color-text-2)">
                          {row.stageLabel}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-(--color-text-2)">
                        {row.description || t("currentProjects.noDescription")}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link href={row.detailHref}>
                        <Button fit type="primary">
                          {t("actions.openFlow")}
                        </Button>
                      </Link>

                      {row.customerHref ? (
                        <Link href={row.customerHref}>
                          <Button fit type="default">
                            {t("actions.viewClient")}
                          </Button>
                        </Link>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-2)">
                        {t("currentProjects.client")}
                      </p>
                      <p className="mt-1 font-semibold">
                        {row.customerName || t("currentProjects.pendingClient")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-2)">
                        {t("currentProjects.plannedValue")}
                      </p>
                      <p className="mt-1 font-semibold">{row.valueLabel}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-2)">
                        {t("currentProjects.nextMilestone")}
                      </p>
                      <p className="mt-1 font-semibold">{row.scheduleLabel}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-2)">
                        {t("currentProjects.owner")}
                      </p>
                      <p className="mt-1 font-semibold">{row.ownerLabel}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-(--color-text-2)">
                        {t("currentProjects.estimatedProgress")}
                      </span>
                      <span className="font-semibold">{row.progressPct}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-(--color-base-1)">
                      <div
                        className="h-2 rounded-full bg-linear-to-r from-sky-500 to-emerald-400"
                        style={{ width: `${row.progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 text-sm text-(--color-text-2) lg:flex-row lg:items-center lg:justify-between">
                    <p>
                      {t("currentProjects.nextAction", {
                        value: row.nextStepLabel,
                      })}
                    </p>
                    <p>
                      {t("currentProjects.updatedAt", {
                        value: row.updatedAtLabel,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="grid gap-4">
          <Card className="border border-(--color-border)">
            <h2 className="text-xl font-bold">{t("attention.title")}</h2>
            <div className="mt-4 grid gap-3">
              {data.attentionItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-(--color-border) bg-(--color-base-2) p-4 text-sm text-(--color-text-2)">
                  {t("attention.empty")}
                </div>
              ) : (
                data.attentionItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4"
                  >
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-(--color-text-2)">
                      {item.description}
                    </p>

                    <div className="mt-3">
                      <Link href={item.href}>
                        <Button fit type="default">
                          {item.hrefLabel}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="border border-(--color-border)">
            <h2 className="text-xl font-bold">{t("activity.title")}</h2>
            <div className="mt-4 grid gap-3">
              {data.recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4"
                >
                  <p className="font-medium">{item.message}</p>
                  <p className="mt-1 text-sm text-(--color-text-2)">
                    {item.createdAtLabel}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
