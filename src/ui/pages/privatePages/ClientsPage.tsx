// src/ui/pages/private/ClientsPage.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import {
  FiCheck,
  FiDownload,
  FiEdit2,
  FiMoreVertical,
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  function close() {
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-(--color-border) bg-(--color-base-1) hover:bg-(--color-base-2)"
        title="Ações"
        type="button"
        onClick={() => setOpen((v) => !v)}
      >
        <FiMoreVertical />
      </button>

      {open ? (
        <div className="absolute right-0 top-11 w-52 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-base-1) shadow-lg">
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-(--color-base-2)"
            onClick={() => {
              close();
              onEdit();
            }}
          >
            <FiEdit2 />
            Editar
          </button>

          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-(--color-base-2)"
            onClick={() => {
              close();
              onToggleActive();
            }}
          >
            {row.isActive ? <FiSlash /> : <FiCheck />}
            {row.isActive ? "Inativar" : "Reativar"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function ClientsPage({ data }: { data: ClientsPageData }) {
  const router = useRouter();
  const sp = useSearchParams();

  const q = sp.get("q") ?? "";
  const status = sp.get("status") ?? "all";
  const recurring = sp.get("recurring") ?? "all";

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ClientFormState>(() => emptyClientForm());

  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const exportHref = "/clientes/export";

  const filteredStatusValue =
    status === "active" || status === "inactive" ? status : "all";
  const recurringValue = recurring === "yes" ? "yes" : "all";

  const rows = useMemo(() => data.rows, [data.rows]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(sp.toString());
    if (value.trim().length === 0 || value === "all") next.delete(key);
    else next.set(key, value);
    next.delete("page");
    router.replace(`/clientes?${next.toString()}`);
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
    // biome-ignore lint/suspicious/noExplicitAny: odeio o Biome, odeio o Biom, odeio o Biomeeeee
    setForm((prev: any) => ({ ...prev, ...patch }));
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
          throw new Error(res?.serverError || "Falha ao criar");
      } else {
        if (!form.id) throw new Error("ID inválido");
        const res = await updateClientAction({ ...payload, id: form.id });
        if (!res?.data?.ok)
          throw new Error(res?.serverError || "Falha ao atualizar");
      }

      setModalOpen(false);
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro";
      alert(msg);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(r: ClientRow) {
    const next = !r.isActive;
    const confirmMsg = next
      ? "Reativar este cliente?"
      : "Inativar este cliente?";
    const ok = window.confirm(confirmMsg);
    if (!ok) return;

    try {
      const res = await setClientActiveAction({ id: r.id, isActive: next });
      if (!res?.data?.ok)
        throw new Error(res?.serverError || "Falha ao atualizar status");
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro";
      alert(msg);
    }
  }

  async function doImport(file: File) {
    setImporting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const r = await fetch("/clientes/import", {
        method: "POST",
        body: fd,
      });

      const json = (await r.json()) as {
        ok: boolean;
        created?: number;
        updated?: number;
        error?: string;
      };
      if (!json.ok) throw new Error(json.error || "Falha ao importar");

      alert(
        `Importação concluída: ${json.created ?? 0} criados, ${json.updated ?? 0} atualizados.`,
      );
      router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro";
      alert(msg);
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Clientes</h1>
          <p className="mt-1 text-(--color-text-2)">
            Gerencie sua base de clientes
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a href={exportHref}>
            <Button type="default">
              <span className="inline-flex items-center gap-2">
                <FiDownload />
                Exportar
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
            type="default"
            disabled={importing}
            onClick={() => fileRef.current?.click()}
          >
            <span className="inline-flex items-center gap-2">
              <FiUpload />
              {importing ? "Importando..." : "Importar"}
            </span>
          </Button>

          <Button type="primary" onClick={openCreate}>
            <span className="inline-flex items-center gap-2">
              <FiPlus />
              Adicionar Cliente
            </span>
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">Novos Clientes</p>
          <p className="mt-2 text-3xl font-extrabold">
            {data.kpis.newThisWeek}
          </p>
          <p className="mt-2 text-sm text-emerald-500">
            +{data.kpis.newThisWeek} esta semana
          </p>
        </Card>

        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">Clientes Ativos</p>
          <p className="mt-2 text-3xl font-extrabold">{data.kpis.active}</p>
          <p className="mt-2 text-sm text-(--color-text-2)">
            {data.kpis.total > 0
              ? Math.round((data.kpis.active / data.kpis.total) * 100)
              : 0}
            % do total
          </p>
        </Card>

        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">Clientes Inativos</p>
          <p className="mt-2 text-3xl font-extrabold">{data.kpis.inactive}</p>
          <p className="mt-2 text-sm text-(--color-text-2)">
            {data.kpis.total > 0
              ? Math.round((data.kpis.inactive / data.kpis.total) * 100)
              : 0}
            % do total
          </p>
        </Card>

        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">Total de Clientes</p>
          <p className="mt-2 text-3xl font-extrabold">{data.kpis.total}</p>
          <p className="mt-2 text-sm text-(--color-text-2)">cadastrados</p>
        </Card>

        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">Clientes Recorrentes</p>
          <p className="mt-2 text-3xl font-extrabold">{data.kpis.recurring}</p>
          <p className="mt-2 text-sm text-(--color-text-2)">
            {data.kpis.active > 0
              ? Math.round((data.kpis.recurring / data.kpis.active) * 100)
              : 0}
            % de ativos
          </p>
        </Card>
      </section>

      <section className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-2)">
            <FiSearch />
          </span>

          <Input
            placeholder="Pesquisar clientes..."
            className="w-full pl-10"
            value={q}
            onChange={(e) => setParam("q", e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <select
            value={filteredStatusValue}
            onChange={(e) => setParam("status", e.target.value)}
            className="h-10 rounded-xl border border-(--color-border) bg-(--color-base-1) px-3 text-sm"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>

          <select
            value={recurringValue}
            onChange={(e) => setParam("recurring", e.target.value)}
            className="h-10 rounded-xl border border-(--color-border) bg-(--color-base-1) px-3 text-sm"
          >
            <option value="all">Todos</option>
            <option value="yes">Recorrentes</option>
          </select>
        </div>
      </section>

      <Card className="border border-(--color-border)">
        <h2 className="text-2xl font-bold">Lista de Contatos</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[980px] w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-sm text-(--color-text-2)">
                <th className="w-12 border-b border-(--color-border) px-4 py-3">
                  <input type="radio" />
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  Cliente
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  Contato
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  Endereço
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  Tipo de Pagamento
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  Status
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  Último Serviço
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  Total de Serviços
                </th>
                <th className="w-16 border-b border-(--color-border) px-4 py-3">
                  Ações
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
                    Nenhum cliente cadastrado
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
                          ID: {r.id.slice(0, 8)}
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
