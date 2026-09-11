"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FiCopy,
  FiTrash2,
  FiUserCheck,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import { removeMemberAction } from "@/actions/(private)/members";
import type { MemberRow, OrgMemberRole } from "@/lib/members";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { useAppFeedback } from "@/ui/base/useAppFeedback";
import { InviteMemberModal } from "./InviteMemberModal";

type SettingsMembersProps = {
  currentRole: OrgMemberRole;
  members: MemberRow[];
  orgName: string;
  orgSlug: string | null;
};

export function SettingsMembers({
  currentRole,
  members,
  orgName,
  orgSlug,
}: SettingsMembersProps) {
  const router = useRouter();
  const feedback = useAppFeedback();
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const canManageMembers = currentRole === "owner" || currentRole === "admin";

  async function handleRemoveMember(member: MemberRow) {
    const ok = await feedback.confirm({
      title: "Remover colaborador?",
      content: `Deseja realmente remover ${member.name} (${member.email}) da empresa ${orgName}?`,
      okText: "Remover",
      cancelText: "Cancelar",
      danger: true,
    });

    if (!ok) return;

    setDeletingId(member.id);
    try {
      const res = await removeMemberAction({ membershipId: member.id });
      if (!res?.data?.ok) {
        throw new Error(res?.serverError || "Erro ao remover membro.");
      }
      feedback.notifySuccess(
        `Colaborador ${member.name} removido com sucesso.`,
      );
      router.refresh();
    } catch (err) {
      feedback.notifyError(err, { fallback: "Erro ao remover membro." });
    } finally {
      setDeletingId(null);
    }
  }

  function handleCopyInviteCode() {
    const code = orgSlug || "";
    if (!code) return;
    void navigator.clipboard.writeText(code);
    feedback.notifySuccess(
      `Código "${code}" copiado para a área de transferência!`,
    );
  }

  return (
    <Card className="border border-(--color-border)">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">
              Equipe & Colaboradores
            </h2>
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-500 border border-blue-500/20">
              {members.length} {members.length === 1 ? "membro" : "membros"}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-(--color-text-2)">
            Colaboradores de campo e gestores com acesso à empresa{" "}
            <strong>{orgName}</strong>.
          </p>
        </div>

        {canManageMembers && (
          <div className="flex flex-wrap items-center gap-2">
            {orgSlug && (
              <Button fit type="default" onClick={handleCopyInviteCode}>
                <span className="inline-flex items-center gap-1.5 text-xs">
                  <FiCopy />
                  Copiar Código de Acesso
                </span>
              </Button>
            )}

            <Button
              testid="settings-add-member"
              type="primary"
              onClick={() => setModalOpen(true)}
            >
              <span className="inline-flex items-center gap-1.5">
                <FiUserPlus />
                Adicionar Colaborador
              </span>
            </Button>
          </div>
        )}
      </div>

      {orgSlug && (
        <div className="mt-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-(--color-text-2) flex items-center justify-between">
          <span>
            Código da sua empresa para novos colaboradores:{" "}
            <strong className="font-mono text-blue-500">{orgSlug}</strong>
          </span>
          <button
            type="button"
            onClick={handleCopyInviteCode}
            className="text-xs font-semibold text-blue-500 hover:underline inline-flex items-center gap-1"
          >
            <FiCopy />
            Copiar
          </button>
        </div>
      )}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="border-b border-(--color-border) bg-(--color-base-2)/50 text-left text-xs font-semibold uppercase tracking-wider text-(--color-text-2)">
              <th className="border-b border-(--color-border) px-4 py-3">
                Membro
              </th>
              <th className="border-b border-(--color-border) px-4 py-3">
                Email
              </th>
              <th className="border-b border-(--color-border) px-4 py-3">
                Papel
              </th>
              <th className="border-b border-(--color-border) px-4 py-3">
                Ingresso
              </th>
              {canManageMembers && (
                <th className="w-16 border-b border-(--color-border) px-4 py-3 text-right">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border)">
            {members.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-(--color-base-2)/40 transition-colors"
              >
                <td className="border-b border-(--color-border) px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--color-base-2) text-xs font-bold text-(--color-text)">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-(--color-text)">
                        {member.name} {member.isCurrentUser ? "(Você)" : ""}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="border-b border-(--color-border) px-4 py-3 text-sm text-(--color-text-2)">
                  {member.email}
                </td>

                <td className="border-b border-(--color-border) px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      member.role === "owner"
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        : member.role === "admin"
                          ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    }`}
                  >
                    {member.role === "owner" ? (
                      <FiUserCheck className="h-3 w-3" />
                    ) : (
                      <FiUsers className="h-3 w-3" />
                    )}
                    {member.roleLabel}
                  </span>
                </td>

                <td className="border-b border-(--color-border) px-4 py-3 text-xs text-(--color-text-2)">
                  {member.joinedAtLabel}
                </td>

                {canManageMembers && (
                  <td className="border-b border-(--color-border) px-4 py-3 text-right">
                    {!member.isCurrentUser && member.role !== "owner" && (
                      <Button
                        fit
                        disabled={deletingId === member.id}
                        type="default"
                        onClick={() => void handleRemoveMember(member)}
                      >
                        <FiTrash2 className="text-rose-500" />
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InviteMemberModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Card>
  );
}
