"use client";

import type { ClientDetailsData } from "@/lib/client-details-utils";
import type { OrgRoleKey } from "@/types/base";
import { ClientDetailsHeader } from "./client-details-components/ClientDetailsHeader";
import { ClientFinancialSummary } from "./client-details-components/ClientFinancialSummary";
import { ClientQuickActions } from "./client-details-components/ClientQuickActions";
import { ClientServiceHistory } from "./client-details-components/ClientServiceHistory";

type ClientDetailsPageProps = {
  client: ClientDetailsData;
  currentRole?: OrgRoleKey;
  orgName?: string;
};

export function ClientDetailsPage({
  client,
  currentRole = "owner",
  orgName = "Nossa Empresa",
}: ClientDetailsPageProps) {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Cabeçalho do Cliente com Resumo Rápido */}
      <ClientDetailsHeader client={client} />

      {/* Ações Rápidas de Campo (WhatsApp, Google Maps, Waze, Contato) */}
      <ClientQuickActions client={client} orgName={orgName} />

      {/* Grid: Histórico Operacional e Resumo Financeiro */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <ClientServiceHistory
          clientId={client.id}
          serviceOrders={client.serviceOrders}
        />

        <ClientFinancialSummary
          clientName={client.name}
          currentRole={currentRole}
          stats={client.stats}
          transactions={client.transactions}
        />
      </div>
    </div>
  );
}
