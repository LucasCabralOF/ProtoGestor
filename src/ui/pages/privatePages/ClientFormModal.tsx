// src/ui/pages/private/ClientFormModal.tsx
"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { FiX } from "react-icons/fi";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { Input } from "@/ui/base/Input";

export type ModalMode = "create" | "edit";

export type ClientFormState = {
  id?: string;
  type: "person" | "company";
  name: string;
  legalName: string;
  document: string;
  email: string;
  phone: string;
  whatsapp: string;
  notes: string;

  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
};

export function emptyClientForm(): ClientFormState {
  return {
    type: "person",
    name: "",
    legalName: "",
    document: "",
    email: "",
    phone: "",
    whatsapp: "",
    notes: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
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

export function ClientFormModal({
  open,
  mode,
  saving,
  form,
  onChange,
  onClose,
  onSubmit,
  subtitle,
}: {
  open: boolean;
  mode: ModalMode;
  saving: boolean;
  form: ClientFormState;
  onChange: (patch: Partial<ClientFormState>) => void;
  onClose: () => void;
  onSubmit: () => void;
  subtitle?: ReactNode;
}) {
  const titleId = useId();

  if (!open) return null;

  const title = mode === "create" ? "Adicionar Cliente" : "Editar Cliente";

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
          className="h-[min(720px,calc(100vh-32px))] w-full max-w-230"
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
                    {subtitle ?? "Dados do cliente"}
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

              {/* Body (scroll real) */}
              <div className="mt-5 flex-1 min-h-0 overflow-y-auto px-6 pb-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Field label="Tipo">
                      {({ labelId }) => (
                        <select
                          aria-labelledby={labelId}
                          value={form.type}
                          onChange={(e) =>
                            onChange({
                              type: e.target.value as "person" | "company",
                            })
                          }
                          className="mt-1 h-10 w-full rounded-xl border border-(--color-border) bg-(--color-base-1) px-3 text-sm"
                        >
                          <option value="person">Pessoa</option>
                          <option value="company">Empresa</option>
                        </select>
                      )}
                    </Field>
                  </div>

                  <div className="md:col-span-2">
                    <Field label="Nome">
                      {({ labelId }) => (
                        <Input
                          aria-labelledby={labelId}
                          className="mt-1 w-full"
                          value={form.name}
                          onChange={(e) => onChange({ name: e.target.value })}
                          placeholder="Ex: João da Silva / ACME Ltda"
                        />
                      )}
                    </Field>
                  </div>

                  <Field label="Razão social (opcional)">
                    {({ labelId }) => (
                      <Input
                        aria-labelledby={labelId}
                        className="mt-1 w-full"
                        value={form.legalName}
                        onChange={(e) =>
                          onChange({ legalName: e.target.value })
                        }
                        placeholder="Ex: ACME Comércio LTDA"
                      />
                    )}
                  </Field>

                  <Field label="Documento (CPF/CNPJ)">
                    {({ labelId }) => (
                      <Input
                        aria-labelledby={labelId}
                        className="mt-1 w-full"
                        value={form.document}
                        onChange={(e) => onChange({ document: e.target.value })}
                        placeholder="Somente números ou formato livre"
                      />
                    )}
                  </Field>

                  <Field label="E-mail">
                    {({ labelId }) => (
                      <Input
                        aria-labelledby={labelId}
                        className="mt-1 w-full"
                        value={form.email}
                        onChange={(e) => onChange({ email: e.target.value })}
                        placeholder="cliente@email.com"
                      />
                    )}
                  </Field>

                  <Field label="WhatsApp">
                    {({ labelId }) => (
                      <Input
                        aria-labelledby={labelId}
                        className="mt-1 w-full"
                        value={form.whatsapp}
                        onChange={(e) => onChange({ whatsapp: e.target.value })}
                        placeholder="(00) 00000-0000"
                      />
                    )}
                  </Field>

                  <Field label="Telefone">
                    {({ labelId }) => (
                      <Input
                        aria-labelledby={labelId}
                        className="mt-1 w-full"
                        value={form.phone}
                        onChange={(e) => onChange({ phone: e.target.value })}
                        placeholder="(00) 0000-0000"
                      />
                    )}
                  </Field>

                  <Field label="CEP">
                    {({ labelId }) => (
                      <Input
                        aria-labelledby={labelId}
                        className="mt-1 w-full"
                        value={form.postalCode}
                        onChange={(e) =>
                          onChange({ postalCode: e.target.value })
                        }
                        placeholder="00000-000"
                      />
                    )}
                  </Field>

                  <div className="md:col-span-2">
                    <Field label="Endereço (linha 1)">
                      {({ labelId }) => (
                        <Input
                          aria-labelledby={labelId}
                          className="mt-1 w-full"
                          value={form.addressLine1}
                          onChange={(e) =>
                            onChange({ addressLine1: e.target.value })
                          }
                          placeholder="Rua, número, bairro"
                        />
                      )}
                    </Field>
                  </div>

                  <div className="md:col-span-2">
                    <Field label="Endereço (linha 2)">
                      {({ labelId }) => (
                        <Input
                          aria-labelledby={labelId}
                          className="mt-1 w-full"
                          value={form.addressLine2}
                          onChange={(e) =>
                            onChange({ addressLine2: e.target.value })
                          }
                          placeholder="Complemento (opcional)"
                        />
                      )}
                    </Field>
                  </div>

                  <Field label="Cidade">
                    {({ labelId }) => (
                      <Input
                        aria-labelledby={labelId}
                        className="mt-1 w-full"
                        value={form.city}
                        onChange={(e) => onChange({ city: e.target.value })}
                        placeholder="Ex: Florianópolis"
                      />
                    )}
                  </Field>

                  <Field label="Estado">
                    {({ labelId }) => (
                      <Input
                        aria-labelledby={labelId}
                        className="mt-1 w-full"
                        value={form.state}
                        onChange={(e) => onChange({ state: e.target.value })}
                        placeholder="Ex: SC"
                      />
                    )}
                  </Field>

                  <div className="md:col-span-2">
                    <Field label="Notas">
                      {({ labelId }) => (
                        <textarea
                          aria-labelledby={labelId}
                          className="mt-1 min-h-24 w-full rounded-xl border border-(--color-border) bg-(--color-base-1) px-3 py-2 text-sm"
                          value={form.notes}
                          onChange={(e) => onChange({ notes: e.target.value })}
                          placeholder="Observações…"
                        />
                      )}
                    </Field>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 border-t border-(--color-border) px-6 py-4">
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <Button type="default" disabled={saving} onClick={onClose}>
                    Cancelar
                  </Button>

                  <Button type="primary" disabled={saving} onClick={onSubmit}>
                    <span className="inline-flex items-center gap-2">
                      {saving ? "Salvando..." : "Salvar"}
                    </span>
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
