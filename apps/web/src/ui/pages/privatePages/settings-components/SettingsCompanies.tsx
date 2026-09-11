"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FiBriefcase, FiCheck, FiPlus } from "react-icons/fi";
import type { OrganizationSummary } from "@/types/base";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { CreateCompanyModal } from "@/ui/pages/layout_private/CreateCompanyModal";
import { setClientCookie } from "@/utils/clientCookies";
import { ACTIVE_ORG_COOKIE } from "@/utils/constants";

type SettingsCompaniesProps = {
  activeOrgId: string;
  organizations: OrganizationSummary[];
};

export function SettingsCompanies({
  activeOrgId,
  organizations,
}: SettingsCompaniesProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);

  async function handleSwitchOrg(orgId: string) {
    if (orgId === activeOrgId) return;
    await setClientCookie(ACTIVE_ORG_COOKIE, orgId);
    startTransition(() => router.refresh());
  }

  return (
    <Card className="border border-(--color-border)">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Minhas Empresas</h2>
          <p className="mt-0.5 text-xs text-(--color-text-2)">
            Alterne entre empresas ou crie uma nova unidade para gerenciar de
            forma independente.
          </p>
        </div>

        <Button
          testid="settings-create-company"
          type="primary"
          onClick={() => setModalOpen(true)}
        >
          <span className="inline-flex items-center gap-1.5">
            <FiPlus />
            Nova Empresa
          </span>
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => {
          const isActive = org.id === activeOrgId;

          return (
            <div
              key={org.id}
              className={`flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                isActive
                  ? "border-(--color-primary) bg-emerald-500/5 ring-1 ring-emerald-500/30"
                  : "border-(--color-border) bg-(--color-base-1) hover:border-(--color-border-hover)"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-(--color-base-2) text-emerald-600 dark:text-emerald-400">
                    <FiBriefcase className="h-4 w-4" />
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      org.role === "owner"
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        : org.role === "admin"
                          ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    }`}
                  >
                    {org.role === "owner"
                      ? "Proprietário"
                      : org.role === "admin"
                        ? "Administrador"
                        : "Colaborador"}
                  </span>
                </div>

                <p className="mt-3 font-semibold text-(--color-text)">
                  {org.name}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                    {org.plan === "enterprise"
                      ? "Plano Empresarial"
                      : org.plan === "pro"
                        ? "Plano Pro"
                        : "Plano Starter"}
                  </span>
                  {org.trialEndsAt ? (
                    <span className="text-[10px] text-(--color-text-2)">
                      • Teste Grátis
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-(--color-text-2)">
                  Código / Slug:{" "}
                  <span className="font-mono">{org.slug ?? org.id}</span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-(--color-border)">
                {isActive ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <FiCheck className="h-3.5 w-3.5" />
                    Empresa Ativa
                  </span>
                ) : (
                  <Button
                    fit
                    disabled={isPending}
                    type="default"
                    onClick={() => void handleSwitchOrg(org.id)}
                  >
                    Alternar para esta
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <CreateCompanyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Card>
  );
}
