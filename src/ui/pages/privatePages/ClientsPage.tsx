// src/ui/pages/private/ClientsPage.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";
import {
  FiCheck,
  FiDownload,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiSlash,
  FiUpload,
} from "react-icons/fi";

import {
  createClientAction,
  setClientActiveAction,
  updateClientAction,
} from "@/actions/(private)/clients";
import type { ClientRow, ClientsPageData } from "@/lib/clients";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { Input } from "@/ui/base/Input";
import { RowActionMenu } from "@/ui/base/RowActionMenu";
import { useAppFeedback } from "@/ui/base/useAppFeedback";

import {
  ClientFormModal,
  type ClientFormState,
  emptyClientForm,
  type ModalMode,
} from "@/ui/pages/privatePages/ClientFormModal";

function Pill({
  tone,
  children,
}: {
  tone: "success" | "neutral";
  children: React.ReactNode;
}) {
  const base =
    "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold";
  const cls =
    tone === "success"
      ? `${base} bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`
      : `${base} bg-(--color-base-2) text-(--color-text-2) border border-(--color-border)`;
  return <span className={cls}>{children}</span>;
}

function rowToForm(r: ClientRow): ClientFormState {
  return {
    id: r.id,
    type: r.type,
    name: r.name ?? "",
    legalName: r.legalName ?? "",
    document: r.document ?? "",
    email: r.email ?? "",
    phone: r.phone ?? "",
    whatsapp: r.whatsapp ?? "",
    notes: r.notes ?? "",
    addressLine1: r.addressLine1 ?? "",
    addressLine2: r.addressLine2 ?? "",
    city: r.city ?? "",
    state: r.state ?? "",
    postalCode: r.postalCode ?? "",
  };
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
  return (
    <RowActionMenu
      items={[
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

export function ClientsPage({ data }: { data: ClientsPageData }) {
  const t = useTranslations("clients");
  const router = useRouter();
  const pathname = usePathname(); // ✅ pega o path real atual
  const sp = useSearchParams();
  const feedback = useAppFeedback();

  const q = sp.get("q") ?? "";
  const status = sp.get("status") ?? "all";
  const recurring = sp.get("recurring") ?? "all";

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ClientFormState>(() => emptyClientForm());

  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const exportHref = "/clients/export";

  const filteredStatusValue =
    status === "active" || status === "inactive" ? status : "all";
  const recurringValue = recurring === "yes" ? "yes" : "all";

  const rows = useMemo(() => data.rows, [data.rows]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(sp.toString());

    if (value.trim().length === 0 || value === "all") next.delete(key);
    else next.set(key, value);

    next.delete("page");

    const qs = next.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;
    router.replace(href, { scroll: false }); // opcional: não pular pro topo
  }

  function openCreate() {
    setModalMode("create");
    setForm(emptyClientForm());
    setModalOpen(true);
  }

  function openEdit(r: ClientRow) {
    setModalMode("edit");
    setForm(rowToForm(r));
    setModalOpen(true);
  }

  function patchForm(patch: Partial<ClientFormState>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  async function onSubmit() {
    setSaving(true);
    try {
      const payload = {
        type: form.type,
        name: form.name,
        legalName: form.legalName || null,
        document: form.document || null,
        email: form.email || null,
        phone: form.phone || null,
        whatsapp: form.whatsapp || null,
        notes: form.notes || null,
        addressLine1: form.addressLine1 || null,
        addressLine2: form.addressLine2 || null,
        city: form.city || null,
        state: form.state || null,
        postalCode: form.postalCode || null,
      };

      if (modalMode === "create") {
        const res = await createClientAction(payload);
        if (!res?.data?.ok)
          throw new Error(res?.serverError || t("feedback.createError"));
      } else {
        if (!form.id) throw new Error(t("feedback.invalidId"));
        const res = await updateClientAction({ ...payload, id: form.id });
        if (!res?.data?.ok)
          throw new Error(res?.serverError || t("feedback.updateError"));
      }

      setModalOpen(false);
      feedback.notifySuccess(
        modalMode === "create" ? t("feedback.created") : t("feedback.updated"),
      );
      router.refresh();
    } catch (e) {
      feedback.notifyError(e, {
        fallback: t("feedback.saveFallback"),
      });
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(r: ClientRow) {
    const next = !r.isActive;
    const ok = await feedback.confirm({
      title: next ? t("confirm.reactivateTitle") : t("confirm.deactivateTitle"),
      content: next
        ? t("confirm.reactivateContent", { name: r.name })
        : t("confirm.deactivateContent", { name: r.name }),
      okText: next ? t("actions.reactivate") : t("actions.deactivate"),
      cancelText: t("actions.cancel"),
      danger: !next,
    });

    if (!ok) return;

    try {
      const res = await setClientActiveAction({ id: r.id, isActive: next });
      if (!res?.data?.ok)
        throw new Error(res?.serverError || t("feedback.statusError"));

      feedback.notifySuccess(
        next ? t("feedback.reactivated") : t("feedback.deactivated"),
      );

      router.refresh();
    } catch (e) {
      feedback.notifyError(e, {
        fallback: t("feedback.statusFallback"),
      });
    }
  }

  async function doImport(file: File) {
    setImporting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const r = await fetch("/clients/import", {
        method: "POST",
        body: fd,
      });

      const json = (await r.json()) as {
        ok: boolean;
        created?: number;
        updated?: number;
        error?: string;
      };
      if (!json.ok) throw new Error(json.error || t("feedback.importError"));

      feedback.notifySuccess(
        t("feedback.importDone", {
          created: json.created ?? 0,
          updated: json.updated ?? 0,
        }),
      );
      router.refresh();
    } catch (e) {
      feedback.notifyError(e, {
        fallback: t("feedback.importFallback"),
      });
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">
            {t("pageTitle")}
          </h1>
          <p className="mt-1 text-(--color-text-2)">{t("pageSubtitle")}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a href={exportHref}>
            <Button testid="clients-export" type="default">
              <span className="inline-flex items-center gap-2">
                <FiDownload />
                {t("actions.export")}
              </span>
            </Button>
          </a>

          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void doImport(f);
              e.currentTarget.value = "";
            }}
          />

          <Button
            testid="clients-import"
            type="default"
            disabled={importing}
            onClick={() => fileRef.current?.click()}
          >
            <span className="inline-flex items-center gap-2">
              <FiUpload />
              {importing ? t("actions.importing") : t("actions.import")}
            </span>
          </Button>

          <Button testid="clients-add" type="primary" onClick={openCreate}>
            <span className="inline-flex items-center gap-2">
              <FiPlus />
              {t("actions.add")}
            </span>
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">
            {t("kpis.newClients")}
          </p>
          <p className="mt-2 text-3xl font-extrabold">
            {data.kpis.newThisWeek}
          </p>
          <p className="mt-2 text-sm text-emerald-500">
            {t("kpis.newThisWeek", { value: data.kpis.newThisWeek })}
          </p>
        </Card>

        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">
            {t("kpis.activeClients")}
          </p>
          <p className="mt-2 text-3xl font-extrabold">{data.kpis.active}</p>
          <p className="mt-2 text-sm text-(--color-text-2)">
            {data.kpis.total > 0
              ? Math.round((data.kpis.active / data.kpis.total) * 100)
              : 0}
            {t("kpis.percentOfTotal", {
              value:
                data.kpis.total > 0
                  ? Math.round((data.kpis.active / data.kpis.total) * 100)
                  : 0,
            })}
          </p>
        </Card>

        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">
            {t("kpis.inactiveClients")}
          </p>
          <p className="mt-2 text-3xl font-extrabold">{data.kpis.inactive}</p>
          <p className="mt-2 text-sm text-(--color-text-2)">
            {data.kpis.total > 0
              ? Math.round((data.kpis.inactive / data.kpis.total) * 100)
              : 0}
            {t("kpis.percentOfTotal", {
              value:
                data.kpis.total > 0
                  ? Math.round((data.kpis.inactive / data.kpis.total) * 100)
                  : 0,
            })}
          </p>
        </Card>

        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">
            {t("kpis.totalClients")}
          </p>
          <p className="mt-2 text-3xl font-extrabold">{data.kpis.total}</p>
          <p className="mt-2 text-sm text-(--color-text-2)">
            {t("kpis.registered")}
          </p>
        </Card>

        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">
            {t("kpis.recurringClients")}
          </p>
          <p className="mt-2 text-3xl font-extrabold">{data.kpis.recurring}</p>
          <p className="mt-2 text-sm text-(--color-text-2)">
            {data.kpis.active > 0
              ? Math.round((data.kpis.recurring / data.kpis.active) * 100)
              : 0}
            {t("kpis.percentOfActive", {
              value:
                data.kpis.active > 0
                  ? Math.round((data.kpis.recurring / data.kpis.active) * 100)
                  : 0,
            })}
          </p>
        </Card>
      </section>

      <section className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-2)">
            <FiSearch />
          </span>

          <Input
            testid="clients-search"
            placeholder={t("filters.searchPlaceholder")}
            className="w-full pl-10"
            value={q}
            onChange={(e) => setParam("q", e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <select
            data-testid="select-clients-status"
            value={filteredStatusValue}
            onChange={(e) => setParam("status", e.target.value)}
            className="h-10 rounded-xl border border-(--color-border) bg-(--color-base-1) px-3 text-sm"
          >
            <option value="all">{t("filters.all")}</option>
            <option value="active">{t("filters.active")}</option>
            <option value="inactive">{t("filters.inactive")}</option>
          </select>

          <select
            data-testid="select-clients-recurring"
            value={recurringValue}
            onChange={(e) => setParam("recurring", e.target.value)}
            className="h-10 rounded-xl border border-(--color-border) bg-(--color-base-1) px-3 text-sm"
          >
            <option value="all">{t("filters.all")}</option>
            <option value="yes">{t("filters.recurring")}</option>
          </select>
        </div>
      </section>

      <Card className="border border-(--color-border)">
        <h2 className="text-2xl font-bold">{t("table.title")}</h2>

        <div className="mt-4 overflow-x-auto">
          <table
            data-testid="table-clients-list"
            className="min-w-245 w-full border-separate border-spacing-0"
          >
            <thead>
              <tr className="text-left text-sm text-(--color-text-2)">
                <th className="w-12 border-b border-(--color-border) px-4 py-3">
                  <input type="radio" />
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.client")}
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.contact")}
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.address")}
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.paymentType")}
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.status")}
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.lastService")}
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.totalServices")}
                </th>
                <th className="w-16 border-b border-(--color-border) px-4 py-3">
                  {t("table.actions")}
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-10 text-center text-(--color-text-2)"
                  >
                    {t("table.empty")}
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="hover:bg-(--color-base-2)">
                    <td className="border-b border-(--color-border) px-4 py-3">
                      <input type="radio" name="clientRow" />
                    </td>

                    <td className="border-b border-(--color-border) px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold">{r.name}</span>
                        <span className="text-xs text-(--color-text-2)">
                          {t("table.id", { id: r.id.slice(0, 8) })}
                        </span>
                      </div>
                    </td>

                    <td className="border-b border-(--color-border) px-4 py-3 text-sm">
                      {r.contactLabel}
                    </td>

                    <td className="border-b border-(--color-border) px-4 py-3 text-sm">
                      {r.addressLabel}
                    </td>

                    <td className="border-b border-(--color-border) px-4 py-3 text-sm">
                      {r.paymentLabel}
                    </td>

                    <td className="border-b border-(--color-border) px-4 py-3">
                      <Pill tone={r.statusTone}>{r.statusLabel}</Pill>
                    </td>

                    <td className="border-b border-(--color-border) px-4 py-3 text-sm">
                      {r.lastServiceLabel}
                    </td>

                    <td className="border-b border-(--color-border) px-4 py-3 text-sm">
                      {r.totalServices}
                    </td>

                    <td className="border-b border-(--color-border) px-4 py-3">
                      <RowActions
                        row={r}
                        onEdit={() => openEdit(r)}
                        onToggleActive={() => void toggleActive(r)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ClientFormModal
        open={modalOpen}
        mode={modalMode}
        saving={saving}
        form={form}
        onChange={patchForm}
        onSubmit={() => void onSubmit()}
        onClose={() => {
          if (!saving) setModalOpen(false);
        }}
      />
    </div>
  );
}
