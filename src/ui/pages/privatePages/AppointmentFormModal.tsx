"use client";

import { useTranslations } from "next-intl";
import { useId, useMemo } from "react";
import { FiInfo, FiRepeat, FiX } from "react-icons/fi";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { Input } from "@/ui/base/Input";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ScheduleModalMode = "create" | "edit";

export type AppointmentFormState = {
  id?: string;
  date: string;
  startTime: string;
  endTime: string;
  locationText: string;
  notes: string;
  serviceOrderId: string;
  recurrenceRule: "none" | "weekly" | "biweekly" | "monthly";
  recurrenceCount: number;
};

export type ServiceOrderOption = {
  id: string;
  title: string;
  customerName: string | null;
};

export function emptyAppointmentForm(): AppointmentFormState {
  return {
    date: "",
    startTime: "",
    endTime: "",
    locationText: "",
    notes: "",
    serviceOrderId: "",
    recurrenceRule: "none",
    recurrenceCount: 1,
  };
}

// ---------------------------------------------------------------------------
// Field helper (a11y via aria-labelledby, padrão do projeto)
// ---------------------------------------------------------------------------

function Field({
  label,
  children,
}: {
  label: string;
  children: (a11y: { labelId: string }) => React.ReactNode;
}) {
  const labelId = useId();
  return (
    <div className="block">
      <span id={labelId} className="text-sm text-(--color-text-2)">
        {label}
      </span>
      {children({ labelId })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AppointmentFormModal({
  serviceOrderOptions,
  form,
  mode,
  onChange,
  onClose,
  onSubmit,
  open,
  saving,
}: {
  serviceOrderOptions: ServiceOrderOption[];
  form: AppointmentFormState;
  mode: ScheduleModalMode;
  onChange: (patch: Partial<AppointmentFormState>) => void;
  onClose: () => void;
  onSubmit: () => void;
  open: boolean;
  saving: boolean;
}) {
  const t = useTranslations("schedule");
  const titleId = useId();
  const isEdit = mode === "edit";

  // Preview de recorrência: quantas visitas serão criadas
  const recurrencePreview = useMemo(() => {
    if (form.recurrenceRule === "none") return null;
    const count = Math.min(Math.max(1, form.recurrenceCount), 52);
    return count === 1
      ? t("modal.recurrencePreviewSingle")
      : t("modal.recurrencePreview", { count });
  }, [form.recurrenceRule, form.recurrenceCount, t]);

  if (!open) return null;

  const title = isEdit ? t("modal.editTitle") : t("modal.createTitle");
  const selectClass =
    "mt-1 h-10 w-full rounded-xl border border-(--color-border) bg-(--color-base-1) px-3 text-sm";

  return (
    <div className="fixed inset-0 z-60">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label={t("actions.close")}
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="h-[min(740px,calc(100vh-32px))] w-full max-w-2xl"
        >
          <Card
            className="h-full overflow-hidden border border-(--color-border) bg-(--color-base-1)"
            style={{ height: "100%" }}
            styles={{ body: { height: "100%", padding: 0 } }}
          >
            <div className="flex h-full min-h-0 flex-col">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 px-6 pt-6">
                <div>
                  <h3 id={titleId} className="text-2xl font-extrabold">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-(--color-text-2)">
                    {t("modal.subtitle")}
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-(--color-border) bg-(--color-base-1) hover:bg-(--color-base-2)"
                  onClick={onClose}
                  title={t("actions.close")}
                  aria-label={t("actions.close")}
                >
                  <FiX />
                </button>
              </div>

              {/* Body */}
              <div className="mt-5 min-h-0 flex-1 overflow-y-auto px-6 pb-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Data */}
                  <Field label={t("modal.date")}>
                    {({ labelId }) => (
                      <Input
                        aria-labelledby={labelId}
                        allowClear={false}
                        className="mt-1 w-full"
                        type="date"
                        value={form.date}
                        onChange={(e) => onChange({ date: e.target.value })}
                      />
                    )}
                  </Field>

                  {/* Local */}
                  <Field label={t("modal.location")}>
                    {({ labelId }) => (
                      <Input
                        aria-labelledby={labelId}
                        className="mt-1 w-full"
                        placeholder={t("modal.locationPlaceholder")}
                        value={form.locationText}
                        onChange={(e) =>
                          onChange({ locationText: e.target.value })
                        }
                      />
                    )}
                  </Field>

                  {/* Hora início */}
                  <Field label={t("modal.startTime")}>
                    {({ labelId }) => (
                      <Input
                        aria-labelledby={labelId}
                        allowClear={false}
                        className="mt-1 w-full"
                        type="time"
                        value={form.startTime}
                        onChange={(e) =>
                          onChange({ startTime: e.target.value })
                        }
                      />
                    )}
                  </Field>

                  {/* Hora fim */}
                  <Field label={t("modal.endTime")}>
                    {({ labelId }) => (
                      <Input
                        aria-labelledby={labelId}
                        allowClear={false}
                        className="mt-1 w-full"
                        type="time"
                        value={form.endTime}
                        onChange={(e) => onChange({ endTime: e.target.value })}
                      />
                    )}
                  </Field>

                  {/* Observações */}
                  <div className="md:col-span-2">
                    <Field label={t("modal.notes")}>
                      {({ labelId }) => (
                        <textarea
                          aria-labelledby={labelId}
                          className="mt-1 min-h-20 w-full rounded-xl border border-(--color-border) bg-(--color-base-1) px-3 py-2 text-sm"
                          placeholder={t("modal.notesPlaceholder")}
                          value={form.notes}
                          onChange={(e) => onChange({ notes: e.target.value })}
                        />
                      )}
                    </Field>
                  </div>

                  {/* OS Vinculada */}
                  <div className="md:col-span-2">
                    <Field label={t("modal.serviceOrder")}>
                      {({ labelId }) => (
                        <select
                          aria-labelledby={labelId}
                          value={form.serviceOrderId}
                          onChange={(e) =>
                            onChange({ serviceOrderId: e.target.value })
                          }
                          className={selectClass}
                        >
                          <option value="">{t("modal.noServiceOrder")}</option>
                          {serviceOrderOptions.map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.title}
                              {o.customerName ? ` — ${o.customerName}` : ""}
                            </option>
                          ))}
                        </select>
                      )}
                    </Field>
                  </div>

                  {/* Recorrência — apenas na criação */}
                  {!isEdit && (
                    <div className="md:col-span-2">
                      <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4">
                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                          <FiRepeat />
                          <span>{t("modal.recurrenceTitle")}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Field label={t("modal.recurrenceRule")}>
                            {({ labelId }) => (
                              <select
                                aria-labelledby={labelId}
                                value={form.recurrenceRule}
                                onChange={(e) =>
                                  onChange({
                                    recurrenceRule: e.target
                                      .value as AppointmentFormState["recurrenceRule"],
                                    recurrenceCount: 1,
                                  })
                                }
                                className={selectClass}
                              >
                                <option value="none">
                                  {t("modal.recurrenceNone")}
                                </option>
                                <option value="weekly">
                                  {t("modal.recurrenceWeekly")}
                                </option>
                                <option value="biweekly">
                                  {t("modal.recurrenceBiweekly")}
                                </option>
                                <option value="monthly">
                                  {t("modal.recurrenceMonthly")}
                                </option>
                              </select>
                            )}
                          </Field>

                          {form.recurrenceRule !== "none" && (
                            <Field label={t("modal.recurrenceCount")}>
                              {({ labelId }) => (
                                <Input
                                  aria-labelledby={labelId}
                                  allowClear={false}
                                  className="mt-1 w-full"
                                  type="number"
                                  min={1}
                                  max={52}
                                  value={String(form.recurrenceCount)}
                                  onChange={(e) =>
                                    onChange({
                                      recurrenceCount:
                                        Number(e.target.value) || 1,
                                    })
                                  }
                                />
                              )}
                            </Field>
                          )}
                        </div>

                        {recurrencePreview && (
                          <p className="mt-3 text-xs font-medium text-emerald-500">
                            {recurrencePreview}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Aviso de série na edição */}
                  {isEdit && (
                    <div className="md:col-span-2 flex items-start gap-2 rounded-xl border border-(--color-border) bg-(--color-base-2) p-3 text-xs text-(--color-text-2)">
                      <FiInfo className="mt-0.5 shrink-0 text-amber-400" />
                      <p>{t("modal.editRecurrenceNote")}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 border-t border-(--color-border) px-6 py-4">
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button type="default" disabled={saving} onClick={onClose}>
                    {t("actions.close")}
                  </Button>
                  <Button type="primary" disabled={saving} onClick={onSubmit}>
                    {saving ? t("actions.saving") : t("actions.save")}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
