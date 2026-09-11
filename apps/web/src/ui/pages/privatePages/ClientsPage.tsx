"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import {
  createClientAction,
  setClientActiveAction,
  updateClientAction,
} from "@/actions/(private)/clients";
import type { ClientRow, ClientsPageData } from "@/lib/clients";
import { useAppFeedback } from "@/ui/base/useAppFeedback";

import {
  ClientFormModal,
  type ClientFormState,
  emptyClientForm,
  type ModalMode,
} from "@/ui/pages/privatePages/ClientFormModal";
import { ClientsFilters } from "@/ui/pages/privatePages/clients-components/ClientsFilters";
import { ClientsHeader } from "@/ui/pages/privatePages/clients-components/ClientsHeader";
import { ClientsKpis } from "@/ui/pages/privatePages/clients-components/ClientsKpis";
import { ClientsTable } from "@/ui/pages/privatePages/clients-components/ClientsTable";

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

export function ClientsPage({ data }: { data: ClientsPageData }) {
  const t = useTranslations("clients");
  const router = useRouter();
  const pathname = usePathname();
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

  const exportHref = "/clients/export";
  const rows = useMemo(() => data.rows, [data.rows]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(sp.toString());

    if (value.trim().length === 0 || value === "all") next.delete(key);
    else next.set(key, value);

    next.delete("page");

    const qs = next.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;
    router.replace(href, { scroll: false });
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
      <ClientsHeader
        exportHref={exportHref}
        importing={importing}
        onImport={(file) => void doImport(file)}
        onNew={openCreate}
      />

      <ClientsKpis kpis={data.kpis} />

      <ClientsFilters
        q={q}
        status={status}
        recurring={recurring}
        onParamChange={setParam}
      />

      <ClientsTable
        rows={rows}
        onEdit={openEdit}
        onToggleActive={(r) => void toggleActive(r)}
      />

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
