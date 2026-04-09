"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { FiX } from "react-icons/fi";
import type { ServiceCustomerOption, ServiceStatus } from "@/lib/services";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { Input } from "@/ui/base/Input";

export type ServiceModalMode = "create" | "edit";

export type ServiceFormState = {
  appointmentDate: string;
  appointmentEndTime: string;
  appointmentId?: string;
  appointmentStartTime: string;
  customerId: string;
  description: string;
  id?: string;
  locationText: string;
  status: ServiceStatus;
  title: string;
  valueInput: string;
};

export function emptyServiceForm(): ServiceFormState {
  return {
    title: "",
    description: "",
    customerId: "",
    status: "draft",
    valueInput: "",
    appointmentDate: "",
    appointmentStartTime: "",
    appointmentEndTime: "",
    locationText: "",
  };
}

function Field({
  label,
  children,
}: {
  label: string;
  children: (a11y: { labelId: string }) => ReactNode;
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

export function ServiceFormModal({
  customerOptions,
  form,
  mode,
  onChange,
  onClose,
  onSubmit,
  open,
  saving,
}: {
  customerOptions: ServiceCustomerOption[];
  form: ServiceFormState;
  mode: ServiceModalMode;
  onChange: (patch: Partial<ServiceFormState>) => void;
  onClose: () => void;
  onSubmit: () => void;
  open: boolean;
  saving: boolean;
}) {
  const titleId = useId();

  if (!open) return null;

  const title = mode === "create" ? "Novo Serviço" : "Editar Serviço";

  return (
    <div className="fixed inset-0 z-60">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Fechar"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="h-[min(760px,calc(100vh-32px))] w-full max-w-230"
        >
          <Card
            className="h-full overflow-hidden border border-(--color-border) bg-(--color-base-1)"
            style={{ height: "100%" }}
            styles={{ body: { height: "100%", padding: 0 } }}
          >
            <div className="flex h-full min-h-0 flex-col">
              <div className="flex items-start justify-between gap-4 px-6 pt-6">
                <div>
                  <h3 id={titleId} className="text-2xl font-extrabold">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-(--color-text-2)">
                    Dados do serviço e primeiro agendamento
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-(--color-border) bg-(--color-base-1) hover:bg-(--color-base-2)"
                  onClick={onClose}
                  title="Fechar"
                  aria-label="Fechar"
                >
                  <FiX />
                </button>
              </div>

              <div className="mt-5 flex-1 min-h-0 overflow-y-auto px-6 pb-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Field label="Título">
                      {({ labelId }) => (
                        <Input
                          aria-labelledby={labelId}
                          className="mt-1 w-full"
                          placeholder="Ex: Limpeza pós-obra"
                          value={form.title}
                          onChange={(e) => onChange({ title: e.target.value })}
                        />
                      )}
                    </Field>
                  </div>

                  <Field label="Cliente">
                    {({ labelId }) => (
                      <select
                        aria-labelledby={labelId}
                        value={form.customerId}
                        onChange={(e) =>
                          onChange({ customerId: e.target.value })
                        }
                        className="mt-1 h-10 w-full rounded-xl border border-(--color-border) bg-(--color-base-1) px-3 text-sm"
                      >
                        <option value="">Sem cliente</option>
                        {customerOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>

                  <Field label="Status">
                    {({ labelId }) => (
                      <select
                        aria-labelledby={labelId}
                        value={form.status}
                        onChange={(e) =>
                          onChange({
                            status: e.target.value as ServiceStatus,
                          })
                        }
                        className="mt-1 h-10 w-full rounded-xl border border-(--color-border) bg-(--color-base-1) px-3 text-sm"
                      >
                        <option value="draft">Rascunho</option>
                        <option value="scheduled">Agendado</option>
                        <option value="in_progress">Em andamento</option>
                        <option value="completed">Concluído</option>
                        <option value="canceled">Cancelado</option>
                      </select>
                    )}
                  </Field>

                  <Field label="Valor (R$)">
                    {({ labelId }) => (
                      <Input
                        aria-labelledby={labelId}
                        className="mt-1 w-full"
                        inputMode="decimal"
                        placeholder="0,00"
                        value={form.valueInput}
                        onChange={(e) =>
                          onChange({ valueInput: e.target.value })
                        }
                      />
                    )}
                  </Field>

                  <div className="md:col-span-2">
                    <Field label="Descrição">
                      {({ labelId }) => (
                        <textarea
                          aria-labelledby={labelId}
                          className="mt-1 min-h-24 w-full rounded-xl border border-(--color-border) bg-(--color-base-1) px-3 py-2 text-sm"
                          placeholder="Escopo, observações e instruções"
                          value={form.description}
                          onChange={(e) =>
                            onChange({ description: e.target.value })
                          }
                        />
                      )}
                    </Field>
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) px-4 py-3">
                      <p className="text-sm font-semibold">
                        Agendamento inicial
                      </p>
                      <p className="mt-1 text-xs text-(--color-text-2)">
                        Preencha data e horários apenas se quiser reservar a
                        primeira visita agora.
                      </p>
                    </div>
                  </div>

                  <Field label="Data">
                    {({ labelId }) => (
                      <Input
                        aria-labelledby={labelId}
                        allowClear={false}
                        className="mt-1 w-full"
                        max="2100-12-31"
                        min="2000-01-01"
                        type="date"
                        value={form.appointmentDate}
                        onChange={(e) =>
                          onChange({ appointmentDate: e.target.value })
                        }
                      />
                    )}
                  </Field>

                  <Field label="Local">
                    {({ labelId }) => (
                      <Input
                        aria-labelledby={labelId}
                        className="mt-1 w-full"
                        placeholder="Ex: Rua das Flores, 123"
                        value={form.locationText}
                        onChange={(e) =>
                          onChange({ locationText: e.target.value })
                        }
                      />
                    )}
                  </Field>

                  <Field label="Início">
                    {({ labelId }) => (
                      <Input
                        aria-labelledby={labelId}
                        allowClear={false}
                        className="mt-1 w-full"
                        type="time"
                        value={form.appointmentStartTime}
                        onChange={(e) =>
                          onChange({ appointmentStartTime: e.target.value })
                        }
                      />
                    )}
                  </Field>

                  <Field label="Fim">
                    {({ labelId }) => (
                      <Input
                        aria-labelledby={labelId}
                        allowClear={false}
                        className="mt-1 w-full"
                        type="time"
                        value={form.appointmentEndTime}
                        onChange={(e) =>
                          onChange({ appointmentEndTime: e.target.value })
                        }
                      />
                    )}
                  </Field>
                </div>
              </div>

              <div className="shrink-0 border-t border-(--color-border) px-6 py-4">
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button type="default" disabled={saving} onClick={onClose}>
                    Cancelar
                  </Button>

                  <Button type="primary" disabled={saving} onClick={onSubmit}>
                    {saving ? "Salvando..." : "Salvar"}
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
