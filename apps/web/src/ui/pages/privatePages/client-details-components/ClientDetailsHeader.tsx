"use client";

import Link from "next/link";
import { FiArrowLeft, FiCheck, FiUser, FiX } from "react-icons/fi";
import type { ClientDetailsData } from "@/lib/client-details-utils";
import { Button } from "@/ui/base/Button";

type ClientDetailsHeaderProps = {
  client: ClientDetailsData;
};

export function ClientDetailsHeader({ client }: ClientDetailsHeaderProps) {
  const nameParts = client.name.trim().split(/\s+/);
  const initials =
    nameParts.length === 1
      ? nameParts[0].slice(0, 2).toUpperCase()
      : (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();

  return (
    <div className="flex flex-col gap-4">
      {/* Botão Voltar */}
      <div>
        <Link href="/clients">
          <Button fit type="default" testid="back-to-clients">
            <span className="inline-flex items-center gap-1.5 text-xs text-(--color-text-2)">
              <FiArrowLeft className="h-3.5 w-3.5" />
              <span>Voltar para Lista de Clientes</span>
            </span>
          </Button>
        </Link>
      </div>

      {/* Identificação do Cliente */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-(--color-border) bg-(--color-base-1) p-5 shadow-xs">
        <div className="flex items-center gap-4">
          {/* Avatar com Iniciais */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-lg border border-emerald-500/20 shadow-xs">
            {initials || <FiUser />}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-(--color-text)">
                {client.name}
              </h1>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  client.isActive
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20"
                }`}
              >
                {client.isActive ? (
                  <>
                    <FiCheck className="h-3 w-3" />
                    Ativo
                  </>
                ) : (
                  <>
                    <FiX className="h-3 w-3" />
                    Inativo
                  </>
                )}
              </span>
            </div>

            {client.legalName && (
              <p className="mt-0.5 text-xs text-(--color-text-2)">
                Razão Social: {client.legalName}
              </p>
            )}

            {client.document && (
              <p className="mt-0.5 text-xs font-mono text-(--color-text-2)">
                Documento: {client.document}
              </p>
            )}

            {/* Tags */}
            {client.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {client.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-md px-2 py-0.5 text-[11px] font-semibold border"
                    style={{
                      backgroundColor: `${tag.color}15`,
                      color: tag.color,
                      borderColor: `${tag.color}30`,
                    }}
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resumo de Atendimentos */}
        <div className="flex items-center gap-3 border-t border-(--color-border) pt-3 sm:border-t-0 sm:pt-0">
          <div className="rounded-xl border border-(--color-border) bg-(--color-base-2) px-4 py-2.5 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-(--color-text-2)">
              Total OS
            </p>
            <p className="text-xl font-black text-(--color-text)">
              {client.stats.totalOrders}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
              Concluídas
            </p>
            <p className="text-xl font-black text-emerald-600">
              {client.stats.completedOrders}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
