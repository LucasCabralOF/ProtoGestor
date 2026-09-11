import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import {
  FiCheck,
  FiEdit2,
  FiExternalLink,
  FiSlash,
  FiUsers,
} from "react-icons/fi";
import type { ClientRow } from "@/lib/clients";
import { Card } from "@/ui/base/Card";
import { RowActionMenu } from "@/ui/base/RowActionMenu";

function ClientStatusPill({
  tone,
  children,
}: {
  tone: "success" | "neutral";
  children: ReactNode;
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold";
  const cls =
    tone === "success"
      ? `${base} bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`
      : `${base} bg-(--color-base-2) text-(--color-text-2) border border-(--color-border)`;

  return (
    <span className={cls}>
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          tone === "success" ? "bg-emerald-400" : "bg-zinc-400"
        }`}
      />
      {children}
    </span>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "C";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0][0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + last).toUpperCase();
}

function RowActions({
  row,
  onEdit,
  onToggleActive,
}: {
  row: ClientRow;
  onEdit: () => void;
  onToggleActive: () => void;
}) {
  const t = useTranslations("clients");
  const router = useRouter();

  return (
    <RowActionMenu
      items={[
        {
          key: "view-profile",
          icon: <FiExternalLink />,
          label: "Ver Ficha 360°",
          onSelect: () => router.push(`/clients/${row.id}`),
        },
        {
          key: "edit",
          icon: <FiEdit2 />,
          label: t("actions.edit"),
          onSelect: onEdit,
        },
        {
          key: "toggle-active",
          icon: row.isActive ? <FiSlash /> : <FiCheck />,
          label: row.isActive
            ? t("actions.deactivate")
            : t("actions.reactivate"),
          onSelect: onToggleActive,
        },
      ]}
    />
  );
}

type ClientsTableProps = {
  onEdit: (row: ClientRow) => void;
  onToggleActive: (row: ClientRow) => void;
  rows: ClientRow[];
};

export function ClientsTable({
  onEdit,
  onToggleActive,
  rows,
}: ClientsTableProps) {
  const t = useTranslations("clients");

  return (
    <Card className="border border-(--color-border) p-0">
      <div className="border-b border-(--color-border) px-6 py-4">
        <h2 className="text-xl font-bold tracking-tight">{t("table.title")}</h2>
      </div>

      <div className="overflow-x-auto">
        <table
          data-testid="table-clients-list"
          className="min-w-245 w-full border-separate border-spacing-0"
        >
          <thead>
            <tr className="border-b border-(--color-border) bg-(--color-base-2)/50 text-left text-xs font-semibold uppercase tracking-wider text-(--color-text-2)">
              <th className="w-12 border-b border-(--color-border) px-4 py-3.5">
                <input
                  type="checkbox"
                  className="rounded border-(--color-border)"
                  aria-label="Selecionar todos"
                />
              </th>
              <th className="border-b border-(--color-border) px-4 py-3.5">
                {t("table.client")}
              </th>
              <th className="border-b border-(--color-border) px-4 py-3.5">
                {t("table.contact")}
              </th>
              <th className="border-b border-(--color-border) px-4 py-3.5">
                {t("table.address")}
              </th>
              <th className="border-b border-(--color-border) px-4 py-3.5">
                {t("table.paymentType")}
              </th>
              <th className="border-b border-(--color-border) px-4 py-3.5">
                {t("table.status")}
              </th>
              <th className="border-b border-(--color-border) px-4 py-3.5">
                {t("table.lastService")}
              </th>
              <th className="border-b border-(--color-border) px-4 py-3.5">
                {t("table.totalServices")}
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
                  colSpan={9}
                  className="px-4 py-16 text-center text-(--color-text-2)"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--color-base-2) text-(--color-text-2)">
                      <FiUsers className="h-6 w-6" />
                    </div>
                    <p className="text-base font-semibold text-(--color-text)">
                      {t("table.empty")}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.id}
                  className="transition-colors hover:bg-(--color-base-2)/50"
                >
                  <td className="border-b border-(--color-border) px-4 py-3.5">
                    <input
                      type="checkbox"
                      name="clientRow"
                      className="rounded border-(--color-border)"
                      aria-label={`Selecionar ${r.name}`}
                    />
                  </td>

                  <td className="border-b border-(--color-border) px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-xs font-bold text-blue-500 border border-blue-500/20">
                        {getInitials(r.name)}
                      </div>
                      <div className="flex flex-col">
                        <Link
                          href={`/clients/${r.id}`}
                          className="font-semibold text-(--color-text) hover:text-blue-500 hover:underline"
                        >
                          {r.name}
                        </Link>
                        <span className="text-xs text-(--color-text-2)">
                          {t("table.id", { id: r.id.slice(0, 8) })}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="border-b border-(--color-border) px-4 py-3.5 text-sm text-(--color-text)">
                    {r.contactLabel}
                  </td>

                  <td className="border-b border-(--color-border) px-4 py-3.5 text-sm text-(--color-text-2)">
                    {r.addressLabel}
                  </td>

                  <td className="border-b border-(--color-border) px-4 py-3.5 text-sm text-(--color-text-2)">
                    {r.paymentLabel}
                  </td>

                  <td className="border-b border-(--color-border) px-4 py-3.5">
                    <ClientStatusPill tone={r.statusTone}>
                      {r.statusLabel}
                    </ClientStatusPill>
                  </td>

                  <td className="border-b border-(--color-border) px-4 py-3.5 text-sm text-(--color-text-2)">
                    {r.lastServiceLabel}
                  </td>

                  <td className="border-b border-(--color-border) px-4 py-3.5 text-sm font-semibold text-(--color-text)">
                    {r.totalServices}
                  </td>

                  <td className="border-b border-(--color-border) px-4 py-3.5 text-right">
                    <RowActions
                      row={r}
                      onEdit={() => onEdit(r)}
                      onToggleActive={() => onToggleActive(r)}
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
