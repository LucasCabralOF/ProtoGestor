"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import {
  FiBriefcase,
  FiCheck,
  FiClock,
  FiEdit2,
  FiSlash,
} from "react-icons/fi";
import type { ServiceRow, ServiceStatus } from "@/lib/services";
import { Card } from "@/ui/base/Card";
import { RowActionMenu } from "@/ui/base/RowActionMenu";

type StatusTone = ServiceRow["statusTone"];

function ServiceStatusPill({
  children,
  tone,
}: {
  children: ReactNode;
  tone: StatusTone;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold";

  const { className, dotColor } =
    tone === "success"
      ? {
          className: `${base} border-emerald-500/20 bg-emerald-500/10 text-emerald-400`,
          dotColor: "bg-emerald-400",
        }
      : tone === "warning"
        ? {
            className: `${base} border-amber-500/20 bg-amber-500/10 text-amber-400`,
            dotColor: "bg-amber-400",
          }
        : tone === "danger"
          ? {
              className: `${base} border-rose-500/20 bg-rose-500/10 text-rose-400`,
              dotColor: "bg-rose-400",
            }
          : tone === "accent"
            ? {
                className: `${base} border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400`,
                dotColor: "bg-emerald-400",
              }
            : {
                className: `${base} border-(--color-border) bg-(--color-base-2) text-(--color-text-2)`,
                dotColor: "bg-zinc-400",
              };

  return (
    <span className={className}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {children}
    </span>
  );
}

function nextPrimaryStatus(
  status: ServiceStatus,
  t: ReturnType<typeof useTranslations<"services">>,
): {
  label: string;
  status: ServiceStatus;
} {
  if (status === "draft") {
    return { label: t("actions.moveToScheduled"), status: "scheduled" };
  }

  if (status === "scheduled") {
    return { label: t("actions.startService"), status: "in_progress" };
  }

  if (status === "in_progress") {
    return { label: t("actions.completeService"), status: "completed" };
  }

  return { label: t("actions.reopenScheduled"), status: "scheduled" };
}

function RowActions({
  onChangeStatus,
  onEdit,
  row,
}: {
  onChangeStatus: (status: ServiceStatus) => void;
  onEdit: () => void;
  row: ServiceRow;
}) {
  const t = useTranslations("services");
  const primaryStatus = nextPrimaryStatus(row.status, t);

  return (
    <RowActionMenu
      minWidthClassName="min-w-56"
      items={[
        {
          key: "edit",
          icon: <FiEdit2 />,
          label: t("actions.edit"),
          onSelect: onEdit,
        },
        {
          key: "primary-status",
          icon: <FiClock />,
          label: primaryStatus.label,
          onSelect: () => onChangeStatus(primaryStatus.status),
        },
        {
          key: "cancel",
          disabled: row.status === "canceled",
          danger: true,
          icon: <FiSlash />,
          label: t("actions.cancelService"),
          onSelect: () => onChangeStatus("canceled"),
        },
        {
          key: "complete",
          disabled: row.status === "completed",
          icon: <FiCheck />,
          label: t("actions.markCompleted"),
          onSelect: () => onChangeStatus("completed"),
        },
      ]}
    />
  );
}

type ServicesTableProps = {
  onChangeStatus: (row: ServiceRow, nextStatus: ServiceStatus) => void;
  onEdit: (row: ServiceRow) => void;
  rows: ServiceRow[];
};

export function ServicesTable({
  onChangeStatus,
  onEdit,
  rows,
}: ServicesTableProps) {
  const t = useTranslations("services");

  return (
    <Card className="border border-(--color-border) p-0">
      <div className="border-b border-(--color-border) px-6 py-4">
        <h2 className="text-xl font-bold tracking-tight">{t("table.title")}</h2>
      </div>

      <div className="overflow-x-auto">
        <table
          data-testid="table-services-list"
          className="min-w-245 w-full border-separate border-spacing-0"
        >
          <thead>
            <tr className="border-b border-(--color-border) bg-(--color-base-2)/50 text-left text-xs font-semibold uppercase tracking-wider text-(--color-text-2)">
              <th className="border-b border-(--color-border) px-4 py-3.5">
                {t("table.service")}
              </th>
              <th className="border-b border-(--color-border) px-4 py-3.5">
                {t("table.client")}
              </th>
              <th className="border-b border-(--color-border) px-4 py-3.5">
                {t("table.status")}
              </th>
              <th className="border-b border-(--color-border) px-4 py-3.5">
                {t("table.value")}
              </th>
              <th className="border-b border-(--color-border) px-4 py-3.5">
                {t("table.schedule")}
              </th>
              <th className="border-b border-(--color-border) px-4 py-3.5">
                {t("table.updated")}
              </th>
              <th className="w-16 border-b border-(--color-border) px-4 py-3.5 text-right">
                {t("table.actions")}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-(--color-border)">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-16 text-center text-(--color-text-2)"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-base-2) text-(--color-text-2)">
                      <FiBriefcase className="h-6 w-6" />
                    </div>
                    <p className="text-base font-semibold text-(--color-text)">
                      {t("table.empty")}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-(--color-base-2)/50"
                >
                  <td className="border-b border-(--color-border) px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-(--color-text)">
                        {row.title}
                      </span>
                      <span className="text-xs text-(--color-text-2)">
                        {row.description || `ID: ${row.id.slice(0, 8)}`}
                      </span>
                    </div>
                  </td>

                  <td className="border-b border-(--color-border) px-4 py-3.5">
                    <div className="flex flex-col text-sm">
                      <span className="font-medium text-(--color-text)">
                        {row.customerLabel}
                      </span>
                      <span className="text-xs text-(--color-text-2)">
                        {row.customerName
                          ? t("table.linkedClient")
                          : t("table.noLink")}
                      </span>
                    </div>
                  </td>

                  <td className="border-b border-(--color-border) px-4 py-3.5">
                    <ServiceStatusPill tone={row.statusTone}>
                      {row.statusLabel}
                    </ServiceStatusPill>
                  </td>

                  <td className="border-b border-(--color-border) px-4 py-3.5 text-sm font-semibold text-(--color-text)">
                    {row.valueLabel}
                  </td>

                  <td className="border-b border-(--color-border) px-4 py-3.5">
                    <div className="flex flex-col text-sm">
                      <span className="font-medium text-(--color-text)">
                        {row.scheduleLabel}
                      </span>
                      <span className="text-xs text-(--color-text-2)">
                        {row.scheduleMetaLabel}
                      </span>
                    </div>
                  </td>

                  <td className="border-b border-(--color-border) px-4 py-3.5 text-sm text-(--color-text-2)">
                    {row.updatedAtLabel}
                  </td>

                  <td className="border-b border-(--color-border) px-4 py-3.5 text-right">
                    <RowActions
                      row={row}
                      onEdit={() => onEdit(row)}
                      onChangeStatus={(nextStatus) =>
                        onChangeStatus(row, nextStatus)
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
