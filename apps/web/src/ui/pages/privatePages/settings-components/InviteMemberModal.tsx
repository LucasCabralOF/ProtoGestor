"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { addMemberAction } from "@/actions/(private)/members";
import { Button } from "@/ui/base/Button";
import { Input } from "@/ui/base/Input";
import { Modal } from "@/ui/base/Modal";
import { useAppFeedback } from "@/ui/base/useAppFeedback";

type InviteMemberModalProps = {
  onClose: () => void;
  open: boolean;
};

export function InviteMemberModal({ onClose, open }: InviteMemberModalProps) {
  const router = useRouter();
  const feedback = useAppFeedback();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Preencha o nome e o email do colaborador.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await addMemberAction({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
      });

      if (!res?.data?.ok) {
        throw new Error(res?.serverError || "Erro ao adicionar colaborador.");
      }

      feedback.notifySuccess(`Colaborador ${name} adicionado com sucesso!`);
      setName("");
      setEmail("");
      setRole("member");
      onClose();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao adicionar colaborador.",
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
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <FiUserPlus className="h-4 w-4" />
          </div>
          <span>Adicionar Colaborador à Equipe</span>
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
          Adicione um membro à equipe. O colaborador terá acesso às ordens de
          serviço, clientes e agenda desta empresa.
        </p>

        <div>
          <span
            id="member-name-label"
            className="block text-sm font-semibold text-(--color-text) mb-1.5"
          >
            Nome do Colaborador
          </span>
          <Input
            aria-labelledby="member-name-label"
            testid="input-member-name"
            placeholder="Ex: Carlos Oliveira"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            className="w-full"
            autoFocus
          />
        </div>

        <div>
          <span
            id="member-email-label"
            className="block text-sm font-semibold text-(--color-text) mb-1.5"
          >
            Email
          </span>
          <Input
            aria-labelledby="member-email-label"
            testid="input-member-email"
            type="email"
            placeholder="carlos@empresa.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            className="w-full"
          />
        </div>

        <div>
          <span
            id="member-role-label"
            className="block text-sm font-semibold text-(--color-text) mb-1.5"
          >
            Cargo / Papel
          </span>
          <select
            aria-labelledby="member-role-label"
            data-testid="select-member-role"
            value={role}
            onChange={(e) => setRole(e.target.value as "member" | "admin")}
            className="h-10 w-full rounded-xl border border-(--color-border) bg-(--color-base-1) px-3 text-sm font-medium text-(--color-text)"
          >
            <option value="member">
              Colaborador (Operação e Atendimentos)
            </option>
            <option value="admin">Administrador (Gestão Operacional)</option>
          </select>
        </div>

        {error ? (
          <p className="text-xs font-medium text-rose-500">{error}</p>
        ) : null}

        <div className="mt-2 flex justify-end gap-2">
          <Button type="default" disabled={loading} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            testid="button-confirm-add-member"
            type="primary"
            loading={loading}
            htmlType="submit"
          >
            Adicionar Colaborador
          </Button>
        </div>
      </form>
    </Modal>
  );
}
