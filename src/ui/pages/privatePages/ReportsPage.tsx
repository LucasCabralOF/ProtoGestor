"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FiDownload } from "react-icons/fi";
import type { ReportsData } from "@/lib/reports";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { PrintableReportBuilder } from "@/ui/pages/privatePages/PrintableReportBuilder";

function buildHref(
  pathname: string,
  searchParams: { toString(): string },
  patch: Partial<Record<"focus" | "range", string>>,
) {
  const next = new URLSearchParams(searchParams.toString());

  for (const [key, value] of Object.entries(patch)) {
    if (!value) {
      next.delete(key);
      continue;
    }

    next.set(key, value);
  }

  const queryString = next.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function ReportsPage({ data }: { data: ReportsData }) {
  const t = useTranslations("reports");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryString = searchParams.toString();
  const exportHref = queryString
    ? `/reports/export?${queryString}`
    : "/reports/export";

  return (
    <div className="flex flex-col gap-6">
      <Card className="report-screen-only border border-(--color-border)">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-extrabold">{t("filters.title")}</h1>
            <p className="mt-2 text-(--color-text-2)">
              {t("generatedAt", {
                period: data.periodLabel,
                generatedAt: data.generatedAtLabel,
              })}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={exportHref}>
              <Button fit type="primary">
                <span className="inline-flex items-center gap-2">
                  <FiDownload />
                  {t("actions.export")}
                </span>
              </Button>
            </Link>
          </div>
        </div>

        <form
          className="mt-5 grid gap-2 sm:grid-cols-[180px_180px_auto]"
          method="get"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-(--color-text-2)">{t("filters.range")}</span>
            <select
              className="rounded-2xl border border-(--color-border) bg-(--color-base-2) px-3 py-2 outline-none"
              defaultValue={data.filters.range}
              name="range"
            >
              <option value="30d">{t("filters.range30d")}</option>
              <option value="90d">{t("filters.range90d")}</option>
              <option value="365d">{t("filters.range365d")}</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-(--color-text-2)">{t("filters.focus")}</span>
            <select
              className="rounded-2xl border border-(--color-border) bg-(--color-base-2) px-3 py-2 outline-none"
              defaultValue={data.filters.focus}
              name="focus"
            >
              <option value="overview">{t("filters.focusOverview")}</option>
              <option value="finance">{t("filters.focusFinance")}</option>
              <option value="operations">{t("filters.focusOperations")}</option>
            </select>
          </label>

          <div className="flex gap-2">
            <Button fit htmlType="submit" type="primary">
              {t("actions.apply")}
            </Button>
            <Link href="/reports">
              <Button fit type="default">
                {t("actions.clear")}
              </Button>
            </Link>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={buildHref(pathname, searchParams, {
              range: "30d",
            })}
          >
            <Button
              fit
              type={data.filters.range === "30d" ? "primary" : "default"}
            >
              {t("filters.range30d")}
            </Button>
          </Link>
          <Link
            href={buildHref(pathname, searchParams, {
              range: "90d",
            })}
          >
            <Button
              fit
              type={data.filters.range === "90d" ? "primary" : "default"}
            >
              {t("filters.range90d")}
            </Button>
          </Link>
          <Link
            href={buildHref(pathname, searchParams, {
              range: "365d",
            })}
          >
            <Button
              fit
              type={data.filters.range === "365d" ? "primary" : "default"}
            >
              {t("filters.range365d")}
            </Button>
          </Link>
        </div>
      </Card>

      <PrintableReportBuilder data={data} />
    </div>
  );
}
