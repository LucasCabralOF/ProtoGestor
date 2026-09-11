"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiBriefcase, FiPlus } from "react-icons/fi";
import { createOrganizationAction } from "@/actions/onboardingActions";
import { Button } from "@/ui/base/Button";
import { Input } from "@/ui/base/Input";
import { Modal } from "@/ui/base/Modal";
import { useAppFeedback } from "@/ui/base/useAppFeedback";

type CreateCompanyModalProps = {
  onClose: () => void;
  open: boolean;
};

export function CreateCompanyModal({ onClose, open }: CreateCompanyModalProps) {
  const router = useRouter();
  const feedback = useAppFeedback();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError("Informe um nome com pelo menos 2 caracteres.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await createOrganizationAction({
        name: name.trim(),
      });

      if (!res?.data?.ok) {
        throw new Error(res?.serverError || "Erro ao criar empresa.");
      }

      feedback.notifySuccess(`Empresa "${res.data.name}" criada com sucesso!`);
      setName("");
      onClose();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao criar nova empresa.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      title={
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <FiBriefcase className="h-4 w-4" />
          </div>
          <span>Criar Nova Empresa</span>
        </div>
      }
      onCancel={() => {
        if (!loading) onClose();
      }}
      footer={null}
      destroyOnClose
    >
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <p className="text-xs text-(--color-text-2)">
          Cadastre uma nova empresa ou filial para gerenciar de forma
          independente. Você será o Proprietário desta nova conta.
        </p>

        <div>
          <span
            id="new-company-name-label"
            className="block text-sm font-semibold text-(--color-text) mb-1.5"
          >
            Nome da Empresa
          </span>
          <Input
            aria-labelledby="new-company-name-label"
            testid="input-new-company-name"
            placeholder="Ex: Climatização Silva & Cia"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            className="w-full"
            autoFocus
          />
          {error ? (
            <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>
          ) : null}
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="default" disabled={loading} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            testid="button-confirm-create-company"
            type="primary"
            loading={loading}
            htmlType="submit"
          >
            <span className="inline-flex items-center gap-1.5">
              <FiPlus />
              Criar Empresa
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
