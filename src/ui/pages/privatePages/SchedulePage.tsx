"use client";

import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS as enUSLocale, ptBR as ptBRLocale } from "date-fns/locale";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Calendar, dateFnsLocalizer, type Event } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { FiPlus, FiSearch } from "react-icons/fi";
import {
  createAppointmentAction,
  updateAppointmentAction,
} from "@/actions/(private)/schedule";
import type { AppointmentRow, SchedulePageData } from "@/lib/schedule";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { Input } from "@/ui/base/Input";
import { useAppFeedback } from "@/ui/base/useAppFeedback";
import {
  AppointmentFormModal,
  type AppointmentFormState,
  emptyAppointmentForm,
  type ScheduleModalMode,
  type ServiceOrderOption,
} from "@/ui/pages/privatePages/AppointmentFormModal";

// Configuração do calendário
const locales = {
  "pt-BR": ptBRLocale,
  en: enUSLocale,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type AppointmentEvent = Event & {
  resource: AppointmentRow;
};

const DnDCalendar = withDragAndDrop<AppointmentEvent, object>(Calendar);

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
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const feedback = useAppFeedback();

  const q = searchParams.get("q") ?? "";
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

  const handleEventDrop = async ({
    event,
    start,
    end,
  }: {
    event: AppointmentEvent;
    start: string | Date;
    end: string | Date;
  }) => {
    try {
      const startDate = new Date(start);
      const endDate = new Date(end);

      const result = await updateAppointmentAction({
        id: event.resource.id,
        date: startDate.toISOString().slice(0, 10),
        startTime: startDate.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        endTime: endDate.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        locationText: event.resource.locationText ?? "",
        notes: event.resource.notes ?? "",
        serviceOrderId: event.resource.serviceOrderId ?? "",
        recurrenceRule: "none",
        recurrenceCount: 1,
      });

      if (!result?.data?.ok) {
        throw new Error(result?.serverError ?? t("feedback.updateError"));
      }

      feedback.notifySuccess(t("feedback.updated"));
      router.refresh();
    } catch (error) {
      feedback.notifyError(error, { fallback: "Erro ao reagendar visita." });
    }
  };

  const events: AppointmentEvent[] = data.rows.map((r) => ({
    title:
      r.customerLabel +
      (r.serviceOrderTitle ? ` - ${r.serviceOrderTitle}` : ""),
    start: new Date(r.startsAt),
    end: new Date(r.endsAt),
    resource: r,
  }));

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
          <p className="text-sm text-(--color-text-2)">{t("kpis.scheduled")}</p>
          <p className="mt-2 text-3xl font-extrabold">{data.kpis.scheduled}</p>
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
          <p className="text-sm text-(--color-text-2)">{t("kpis.canceled")}</p>
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

      <Card className="border border-(--color-border) p-4 md:p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] dark:bg-(--color-base-1)">
        <div className="h-[75vh] min-h-[600px] w-full">
          <DnDCalendar
            localizer={localizer}
            culture={locale === "pt-BR" ? "pt-BR" : "en"}
            events={events}
            defaultView="week"
            views={["month", "week", "day", "agenda"]}
            selectable
            onSelectEvent={(event) => openEdit(event.resource)}
            onSelectSlot={(slotInfo) => {
              setModalMode("create");
              setForm({
                ...emptyAppointmentForm(),
                date: slotInfo.start.toISOString().slice(0, 10),
                startTime: slotInfo.start.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                endTime: slotInfo.end.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              });
              setModalOpen(true);
            }}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventDrop}
            resizable
            messages={{
              next: t("calendar.next"),
              previous: t("calendar.previous"),
              today: t("calendar.today"),
              month: t("calendar.month"),
              week: t("calendar.week"),
              day: t("calendar.day"),
              agenda: t("calendar.agenda"),
              date: t("table.date"),
              time: t("table.time", { defaultMessage: "Hora" }),
              event: t("table.event", { defaultMessage: "Visita" }),
              noEventsInRange: t("table.empty"),
              showMore: (total) => `+${total} mais`,
            }}
            eventPropGetter={(event) => {
              let className = "bg-(--color-primary) border-(--color-primary)";
              switch (event.resource.statusTone) {
                case "success":
                  className = "bg-emerald-500 border-emerald-600";
                  break;
                case "danger":
                  className = "bg-rose-500 border-rose-600";
                  break;
                case "warning":
                  className = "bg-amber-500 border-amber-600";
                  break;
                default:
                  break;
              }
              return { className };
            }}
          />
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
