"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  FiCheck,
  FiClock,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiSlash,
} from "react-icons/fi";
import {
  createServiceAction,
  setServiceStatusAction,
  updateServiceAction,
} from "@/actions/(private)/services";
import type {
  ServiceRow,
  ServiceStatus,
  ServicesPageData,
} from "@/lib/services";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { Input } from "@/ui/base/Input";
import { RowActionMenu } from "@/ui/base/RowActionMenu";
import { useAppFeedback } from "@/ui/base/useAppFeedback";
import {
  emptyServiceForm,
  ServiceFormModal,
  type ServiceFormState,
  type ServiceModalMode,
} from "@/ui/pages/privatePages/ServiceFormModal";

type StatusTone = ServiceRow["statusTone"];
const MIN_APPOINTMENT_DATE = "2000-01-01";
const MAX_APPOINTMENT_DATE = "2100-12-31";

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
      : tone === "warning"
        ? `${base} border-amber-500/20 bg-amber-500/10 text-amber-400`
        : tone === "danger"
          ? `${base} border-rose-500/20 bg-rose-500/10 text-rose-400`
          : tone === "accent"
            ? `${base} border-sky-500/20 bg-sky-500/10 text-sky-400`
            : `${base} border-(--color-border) bg-(--color-base-2) text-(--color-text-2)`;

  return <span className={className}>{children}</span>;
}

function rowToForm(row: ServiceRow): ServiceFormState {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    customerId: row.customerId ?? "",
    status: row.status,
    valueInput: row.valueInput,
    appointmentId: row.appointmentId ?? undefined,
    appointmentDate: row.appointmentDate,
    appointmentStartTime: row.appointmentStartTime,
    appointmentEndTime: row.appointmentEndTime,
    locationText: row.locationText,
  };
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

export function ServicesPage({ data }: { data: ServicesPageData }) {
  const t = useTranslations("services");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const feedback = useAppFeedback();

  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "all";
  const customerId = searchParams.get("customerId") ?? "";

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ServiceModalMode>("create");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ServiceFormState>(() => emptyServiceForm());

  const rows = useMemo(() => data.rows, [data.rows]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());

    if (value.trim().length === 0 || value === "all") next.delete(key);
    else next.set(key, value);

    const qs = next.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;
    router.replace(href, { scroll: false });
  }

  function openCreate() {
    setModalMode("create");
    setForm(emptyServiceForm());
    setModalOpen(true);
  }

  function openEdit(row: ServiceRow) {
    setModalMode("edit");
    setForm(rowToForm(row));
    setModalOpen(true);
  }

  function patchForm(patch: Partial<ServiceFormState>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  async function onSubmit() {
    setSaving(true);

    try {
      const appointmentDate = form.appointmentDate.trim();
      const appointmentStartTime = form.appointmentStartTime.trim();
      const appointmentEndTime = form.appointmentEndTime.trim();
      const hasAnyAppointmentCore =
        !!appointmentDate || !!appointmentStartTime || !!appointmentEndTime;

      if (
        hasAnyAppointmentCore &&
        (!appointmentDate || !appointmentStartTime || !appointmentEndTime)
      ) {
        feedback.notifyError(t("feedback.appointmentIncomplete"));
        return;
      }

      if (
        appointmentDate &&
        (appointmentDate < MIN_APPOINTMENT_DATE ||
          appointmentDate > MAX_APPOINTMENT_DATE)
      ) {
        feedback.notifyError(t("feedback.appointmentInvalidDate"));
        return;
      }

      if (
        appointmentDate &&
        appointmentStartTime &&
        appointmentEndTime &&
        appointmentEndTime <= appointmentStartTime
      ) {
        feedback.notifyError(t("feedback.appointmentInvalidRange"));
        return;
      }

      const payload = {
        title: form.title,
        description: form.description || null,
        customerId: form.customerId || null,
        status: form.status,
        valueInput: form.valueInput || null,
        appointmentDate: appointmentDate || null,
        appointmentStartTime: appointmentStartTime || null,
        appointmentEndTime: appointmentEndTime || null,
        locationText: hasAnyAppointmentCore ? form.locationText || null : null,
        clearAppointment:
          modalMode === "edit" &&
          !!form.appointmentId &&
          !hasAnyAppointmentCore,
      };

      if (modalMode === "create") {
        const result = await createServiceAction(payload);
        if (!result?.data?.ok) {
          throw new Error(result?.serverError || t("feedback.createError"));
        }
      } else {
        if (!form.id) throw new Error(t("feedback.invalidId"));

        const result = await updateServiceAction({
          ...payload,
          id: form.id,
        });

        if (!result?.data?.ok) {
          throw new Error(result?.serverError || t("feedback.updateError"));
        }
      }

      setModalOpen(false);
      feedback.notifySuccess(
        modalMode === "create" ? t("feedback.created") : t("feedback.updated"),
      );
      router.refresh();
    } catch (error) {
      feedback.notifyError(error, {
        fallback: t("feedback.saveFallback"),
      });
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(row: ServiceRow, nextStatus: ServiceStatus) {
    const verb =
      nextStatus === "completed"
        ? t("confirm.verbComplete")
        : nextStatus === "canceled"
          ? t("confirm.verbCancel")
          : t("confirm.verbUpdate");

    const confirmed = await feedback.confirm({
      title: t("confirm.title"),
      content: t("confirm.content", { verb, name: row.title }),
      okText: t("confirm.ok"),
      cancelText: t("confirm.cancel"),
      danger: nextStatus === "canceled",
    });

    if (!confirmed) return;

    try {
      const result = await setServiceStatusAction({
        id: row.id,
        status: nextStatus,
      });

      if (!result?.data?.ok) {
        throw new Error(result?.serverError || t("feedback.statusError"));
      }

      feedback.notifySuccess(t("feedback.statusUpdated"));
      router.refresh();
    } catch (error) {
      feedback.notifyError(error, {
        fallback: t("feedback.statusFallback"),
      });
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

        <div className="flex gap-2">
          <Button type="primary" onClick={openCreate}>
            <span className="inline-flex items-center gap-2">
              <FiPlus />
              {t("actions.new")}
            </span>
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">{t("kpis.total")}</p>
          <p className="mt-2 text-3xl font-extrabold">{data.kpis.total}</p>
          <p className="mt-2 text-sm text-(--color-text-2)">
            {t("kpis.totalHint")}
          </p>
        </Card>

        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">{t("kpis.scheduled")}</p>
          <p className="mt-2 text-3xl font-extrabold">{data.kpis.scheduled}</p>
          <p className="mt-2 text-sm text-(--color-text-2)">
            {t("kpis.scheduledHint")}
          </p>
        </Card>

        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">
            {t("kpis.inProgress")}
          </p>
          <p className="mt-2 text-3xl font-extrabold">{data.kpis.inProgress}</p>
          <p className="mt-2 text-sm text-(--color-text-2)">
            {t("kpis.inProgressHint")}
          </p>
        </Card>

        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">{t("kpis.completed")}</p>
          <p className="mt-2 text-3xl font-extrabold">{data.kpis.completed}</p>
          <p className="mt-2 text-sm text-(--color-text-2)">
            {t("kpis.completedHint")}
          </p>
        </Card>

        <Card className="border border-(--color-border)">
          <p className="text-sm text-(--color-text-2)">{t("kpis.upcoming")}</p>
          <p className="mt-2 text-3xl font-extrabold">{data.kpis.upcoming}</p>
          <p className="mt-2 text-sm text-(--color-text-2)">
            {t("kpis.upcomingHint")}
          </p>
        </Card>
      </section>

      <section className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full flex-1">
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
          <select
            value={status}
            onChange={(e) => setParam("status", e.target.value)}
            className="h-10 rounded-xl border border-(--color-border) bg-(--color-base-1) px-3 text-sm"
          >
            <option value="all">{t("filters.allStatuses")}</option>
            <option value="draft">{t("filters.draft")}</option>
            <option value="scheduled">{t("filters.scheduled")}</option>
            <option value="in_progress">{t("filters.inProgress")}</option>
            <option value="completed">{t("filters.completed")}</option>
            <option value="canceled">{t("filters.canceled")}</option>
          </select>

          <select
            value={customerId}
            onChange={(e) => setParam("customerId", e.target.value)}
            className="h-10 rounded-xl border border-(--color-border) bg-(--color-base-1) px-3 text-sm"
          >
            <option value="">{t("filters.allCustomers")}</option>
            {data.customerOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <Card className="border border-(--color-border)">
        <h2 className="text-2xl font-bold">{t("table.title")}</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[980px] w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-sm text-(--color-text-2)">
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.service")}
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.client")}
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.status")}
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.value")}
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.schedule")}
                </th>
                <th className="border-b border-(--color-border) px-4 py-3">
                  {t("table.updated")}
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
                    colSpan={7}
                    className="px-4 py-10 text-center text-(--color-text-2)"
                  >
                    {t("table.empty")}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-(--color-base-2)">
                    <td className="border-b border-(--color-border) px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold">{row.title}</span>
                        <span className="text-xs text-(--color-text-2)">
                          {row.description || `ID: ${row.id.slice(0, 8)}`}
                        </span>
                      </div>
                    </td>

                    <td className="border-b border-(--color-border) px-4 py-3">
                      <div className="flex flex-col text-sm">
                        <span>{row.customerLabel}</span>
                        <span className="text-xs text-(--color-text-2)">
                          {row.customerName
                            ? t("table.linkedClient")
                            : t("table.noLink")}
                        </span>
                      </div>
                    </td>

                    <td className="border-b border-(--color-border) px-4 py-3">
                      <Pill tone={row.statusTone}>{row.statusLabel}</Pill>
                    </td>

                    <td className="border-b border-(--color-border) px-4 py-3 text-sm">
                      {row.valueLabel}
                    </td>

                    <td className="border-b border-(--color-border) px-4 py-3">
                      <div className="flex flex-col text-sm">
                        <span>{row.scheduleLabel}</span>
                        <span className="text-xs text-(--color-text-2)">
                          {row.scheduleMetaLabel}
                        </span>
                      </div>
                    </td>

                    <td className="border-b border-(--color-border) px-4 py-3 text-sm">
                      {row.updatedAtLabel}
                    </td>

                    <td className="border-b border-(--color-border) px-4 py-3">
                      <RowActions
                        row={row}
                        onEdit={() => openEdit(row)}
                        onChangeStatus={(nextStatus) =>
                          void changeStatus(row, nextStatus)
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

      <ServiceFormModal
        customerOptions={data.customerOptions}
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
