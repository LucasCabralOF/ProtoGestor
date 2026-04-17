"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  FiCheck,
  FiEdit2,
  FiPlus,
  FiRepeat,
  FiSearch,
  FiSlash,
} from "react-icons/fi";
import {
  createAppointmentAction,
  setAppointmentStatusAction,
  updateAppointmentAction,
} from "@/actions/(private)/schedule";
import type { AppointmentRow, SchedulePageData } from "@/lib/schedule";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { Input } from "@/ui/base/Input";
import { RowActionMenu } from "@/ui/base/RowActionMenu";
import { useAppFeedback } from "@/ui/base/useAppFeedback";
import {
  AppointmentFormModal,
  emptyAppointmentForm,
  type AppointmentFormState,
  type ScheduleModalMode,
  type ServiceOrderOption,
} from "@/ui/pages/privatePages/AppointmentFormModal";

// ---------------------------------------------------------------------------
// Status pill
// ---------------------------------------------------------------------------

type StatusTone = AppointmentRow["statusTone"];

function Pill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: StatusTone;
}) {
  const base =
    "inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold";
  const className =
    tone === "success"
      ? `${base} border-emerald-500/20 bg-emerald-500/10 text-emerald-400`
      : tone === "danger"
        ? `${base} border-rose-500/20 bg-rose-500/10 text-rose-400`
        : tone === "warning"
          ? `${base} border-amber-500/20 bg-amber-500/10 text-amber-400`
          : `${base} border-(--color-border) bg-(--color-base-2) text-(--color-text-2)`;
  return <span className={className}>{children}</span>;
}

// ---------------------------------------------------------------------------
// RowActions
// ---------------------------------------------------------------------------

function RowActions({
  row,
  onEdit,
  onChangeStatus,
}: {
  row: AppointmentRow;
  onEdit: () => void;
  onChangeStatus: (status: "scheduled" | "done" | "canceled") => void;
}) {
  const t = useTranslations("schedule");
  return (
    <RowActionMenu
      minWidthClassName="min-w-52"
      items={[
        {
          key: "edit",
          icon: <FiEdit2 />,
          label: t("actions.edit"),
          onSelect: onEdit,
        },
        {
          key: "done",
          icon: <FiCheck />,
          label: t("actions.markDone"),
          disabled: row.status === "done",
          onSelect: () => onChangeStatus("done"),
        },
        {
          key: "cancel",
          icon: <FiSlash />,
          label: t("actions.cancel"),
          disabled: row.status === "canceled",
          danger: true,
          onSelect: () => onChangeStatus("canceled"),
        },
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function SchedulePage({
  data,
  serviceOrderOptions,
}: {
  data: SchedulePageData;
  serviceOrderOptions: ServiceOrderOption[];
}) {
  const t = useTranslations("schedule");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const feedback = useAppFeedback();

  const q = searchParams.get("q") ?? "";
  const period = searchParams.get("period") ?? "all";
  const status = searchParams.get("status") ?? "all";
  const customerId = searchParams.get("customerId") ?? "";

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ScheduleModalMode>("create");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AppointmentFormState>(() =>
    emptyAppointmentForm(),
  );

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function openCreate() {
    setModalMode("create");
    setForm(emptyAppointmentForm());
    setModalOpen(true);
  }

  function openEdit(row: AppointmentRow) {
    setModalMode("edit");
    setForm({
      id: row.id,
      date: row.startsAt.toISOString().slice(0, 10),
      startTime: row.startsAt.toISOString().slice(11, 16),
      endTime: row.endsAt.toISOString().slice(11, 16),
      locationText: row.locationText ?? "",
      notes: row.notes ?? "",
      serviceOrderId: row.serviceOrderId ?? "",
      recurrenceRule: row.recurrenceRule,
      recurrenceCount: row.recurrenceCount,
    });
    setModalOpen(true);
  }

  function patchForm(patch: Partial<AppointmentFormState>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  async function onSubmit() {
    setSaving(true);
    try {
      if (modalMode === "create") {
        const result = await createAppointmentAction({
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
          locationText: form.locationText || null,
          notes: form.notes || null,
          serviceOrderId: form.serviceOrderId || null,
          recurrenceRule: form.recurrenceRule,
          recurrenceCount: form.recurrenceCount,
        });
        if (!result?.data?.ok)
          throw new Error(result?.serverError ?? t("feedback.createError"));
        feedback.notifySuccess(t("feedback.created"));
      } else {
        if (!form.id) throw new Error(t("feedback.invalidId"));
        const result = await updateAppointmentAction({
          id: form.id,
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
          locationText: form.locationText || null,
          notes: form.notes || null,
          serviceOrderId: form.serviceOrderId || null,
          // recurrence ignorada no update — apenas visita individual
          recurrenceRule: "none",
          recurrenceCount: 1,
        });
        if (!result?.data?.ok)
          throw new Error(result?.serverError ?? t("feedback.updateError"));
        feedback.notifySuccess(t("feedback.updated"));
      }
      setModalOpen(false);
      router.refresh();
    } catch (error) {
      feedback.notifyError(error, { fallback: t("feedback.saveFallback") });
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(
    row: AppointmentRow,
    nextStatus: "scheduled" | "done" | "canceled",
  ) {
    const confirmed = await feedback.confirm({
      title: t("confirm.title"),
      content:
        nextStatus === "done"
          ? t("confirm.contentDone")
          : t("confirm.contentCancel"),
      okText: t("confirm.ok"),
      cancelText: t("confirm.cancel"),
      danger: nextStatus === "canceled",
    });
    if (!confirmed) return;

    try {
      const result = await setAppointmentStatusAction({
        id: row.id,
        status: nextStatus,
      });
      if (!result?.data?.ok)
        throw new Error(result?.serverError ?? t("feedback.statusError"));
      feedback.notifySuccess(t("feedback.statusUpdated"));
      router.refresh();
    } catch (error) {
      feedback.notifyError(error, { fallback: t("feedback.statusFallback") });
    }
  }

  const selectClass =
    "h-10 rounded-xl border border-(--color-border) bg-(--color-base-1) px-3 text-sm";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight">
            {t("pageTitle")}
          </h1>
          <p className="mt-1 text-(--color-text-2)">{t("pageSubtitle")}</p>
        </div>
        <Button type="primary" onClick={openCreate}>
          <span className="inline-flex items-center gap-2">
            <FiPlus />
            {t("actions.new")}
          </span>
        </Button>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">{t("kpis.today")}</p>
          <p className="mt-2 text-3xl font-extrabold">{data.kpis.today}</p>
          <p className="mt-1 text-xs text-(--color-text-2)">
            {t("kpis.todayHint")}
          </p>
        </Card>
        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">
            {t("kpis.scheduled")}
          </p>
          <p className="mt-2 text-3xl font-extrabold">
            {data.kpis.scheduled}
          </p>
          <p className="mt-1 text-xs text-(--color-text-2)">
            {t("kpis.scheduledHint")}
          </p>
        </Card>
        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">{t("kpis.done")}</p>
          <p className="mt-2 text-3xl font-extrabold">{data.kpis.done}</p>
          <p className="mt-1 text-xs text-(--color-text-2)">
            {t("kpis.doneHint")}
          </p>
        </Card>
        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">
            {t("kpis.canceled")}
          </p>
          <p className="mt-2 text-3xl font-extrabold">{data.kpis.canceled}</p>
          <p className="mt-1 text-xs text-(--color-text-2)">
            {t("kpis.canceledHint")}
          </p>
        </Card>
      </section>

      {/* Filtros */}
      <section className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Busca */}
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-2)">
            <FiSearch />
          </span>
          <Input
            className="w-full pl-10"
            placeholder={t("filters.searchPlaceholder")}
            value={q}
            onChange={(e) => setParam("q", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          {/* Período */}
          <select
            value={period}
            onChange={(e) => setParam("period", e.target.value)}
            className={selectClass}
          >
            <option value="all">{t("filters.allPeriods")}</option>
            <option value="today">{t("filters.today")}</option>
            <option value="week">{t("filters.week")}</option>
            <option value="month">{t("filters.month")}</option>
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => setParam("status", e.target.value)}
            className={selectClass}
          >
            <option value="all">{t("filters.allStatuses")}</option>
            <option value="scheduled">{t("filters.scheduled")}</option>
            <option value="done">{t("filters.done")}</option>
            <option value="canceled">{t("filters.canceled")}</option>
          </select>

          {/* Cliente */}
          <select
            value={customerId}
            onChange={(e) => setParam("customerId", e.target.value)}
            className={selectClass}
          >
            <option value="">{t("filters.allCustomers")}</option>
            {data.customerOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Tabela */}
      <Card className="border border-(--color-border)">
        <h2 className="text-2xl font-bold">{t("table.title")}</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[800px] border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-sm text-(--color-text-2)">
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.date")}
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.customer")}
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.location")}
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.serviceOrder")}
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.status")}
                </th>
                <th className="w-16 border-b border-(--color-border) px-4 py-3">
                  {t("table.actions")}
                </th>
              </tr>
            </thead>

            <tbody>
              {data.rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-(--color-text-2)"
                  >
                    {t("table.empty")}
                  </td>
                </tr>
              ) : (
                data.rows.map((row) => (
                  <tr key={row.id} className="hover:bg-(--color-base-2)">
                    {/* Data/Hora */}
                    <td className="border-b border-(--color-border) px-4 py-3">
                      <div className="flex flex-col text-sm">
                        <span className="font-semibold">{row.dateLabel}</span>
                        <span className="text-xs text-(--color-text-2)">
                          {row.timeLabel}
                        </span>
                      </div>
                    </td>

                    {/* Cliente */}
                    <td className="border-b border-(--color-border) px-4 py-3 text-sm">
                      {row.customerLabel}
                    </td>

                    {/* Local */}
                    <td className="border-b border-(--color-border) px-4 py-3 text-sm">
                      <div className="flex flex-col">
                        <span>
                          {row.locationText ?? (
                            <span className="text-(--color-text-2)">
                              {t("table.noLocation")}
                            </span>
                          )}
                        </span>
                        {row.notes && (
                          <span className="text-xs text-(--color-text-2)">
                            {row.notes}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* OS */}
                    <td className="border-b border-(--color-border) px-4 py-3 text-sm">
                      {row.serviceOrderTitle ? (
                        <Link
                          href="/services"
                          className="text-(--color-accent-1) hover:underline"
                        >
                          {row.serviceOrderTitle}
                        </Link>
                      ) : (
                        <span className="text-(--color-text-2)">
                          {t("table.noServiceOrder")}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="border-b border-(--color-border) px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Pill tone={row.statusTone}>{row.statusLabel}</Pill>
                        {/* Ícone de recorrência se a visita é raiz de uma série */}
                        {row.isRecurrenceRoot && (
                          <FiRepeat
                            className="text-xs text-(--color-text-2)"
                            title={`${row.recurrenceRule} ×${row.recurrenceCount}`}
                          />
                        )}
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="border-b border-(--color-border) px-4 py-3">
                      <RowActions
                        row={row}
                        onEdit={() => openEdit(row)}
                        onChangeStatus={(s) =>
                          void changeStatus(row, s)
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

      {/* Modal */}
      <AppointmentFormModal
        serviceOrderOptions={serviceOrderOptions}
        form={form}
        mode={modalMode}
        onChange={patchForm}
        onClose={() => {
          if (!saving) setModalOpen(false);
        }}
        onSubmit={() => void onSubmit()}
        open={modalOpen}
        saving={saving}
      />
    </div>
  );
}
