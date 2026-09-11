"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import {
  createServiceAction,
  setServiceStatusAction,
  updateServiceAction,
} from "@/actions/(private)/services";
import type { RecurrenceSuggestion } from "@/lib/recurrence-utils";
import type {
  ServiceRow,
  ServiceStatus,
  ServicesPageData,
} from "@/lib/services";
import { useAppFeedback } from "@/ui/base/useAppFeedback";
import { RecurrenceSuggestionModal } from "@/ui/pages/privatePages/RecurrenceSuggestionModal";
import {
  emptyServiceForm,
  ServiceFormModal,
  type ServiceFormState,
  type ServiceModalMode,
} from "@/ui/pages/privatePages/ServiceFormModal";
import { ServicesFilters } from "@/ui/pages/privatePages/services-components/ServicesFilters";
import { ServicesHeader } from "@/ui/pages/privatePages/services-components/ServicesHeader";
import { ServicesKpis } from "@/ui/pages/privatePages/services-components/ServicesKpis";
import { ServicesTable } from "@/ui/pages/privatePages/services-components/ServicesTable";

const MIN_APPOINTMENT_DATE = "2000-01-01";
const MAX_APPOINTMENT_DATE = "2100-12-31";

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
  const [suggestion, setSuggestion] = useState<RecurrenceSuggestion | null>(
    null,
  );
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);

  const rows = useMemo(() => data.rows, [data.rows]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());

    if (value.trim().length === 0 || value === "all") next.delete(key);
    else next.set(key, value);

    next.delete("page");

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

      if (result.data?.suggestion) {
        setSuggestion(result.data.suggestion);
        setSuggestionModalOpen(true);
      }
    } catch (error) {
      feedback.notifyError(error, {
        fallback: t("feedback.statusFallback"),
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <ServicesHeader onNew={openCreate} />

      <ServicesKpis kpis={data.kpis} />

      <ServicesFilters
        customerId={customerId}
        customerOptions={data.customerOptions}
        onParamChange={setParam}
        q={q}
        status={status}
      />

      <ServicesTable
        onChangeStatus={(row, nextStatus) => void changeStatus(row, nextStatus)}
        onEdit={openEdit}
        rows={rows}
      />

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

      <RecurrenceSuggestionModal
        open={suggestionModalOpen}
        suggestion={suggestion}
        onClose={() => setSuggestionModalOpen(false)}
        onScheduled={() => router.refresh()}
      />
    </div>
  );
}
