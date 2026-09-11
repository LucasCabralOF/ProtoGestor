"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  cancelTransactionAction,
  markTransactionPaidAction,
} from "@/actions/(private)/finance";
import type {
  FinanceFilters as FinanceFiltersType,
  FinancePageData,
} from "@/lib/finance-utils";
import { useAppFeedback } from "@/ui/base/useAppFeedback";
import { FinanceFilters } from "@/ui/pages/privatePages/finance-components/FinanceFilters";
import { FinanceHeader } from "@/ui/pages/privatePages/finance-components/FinanceHeader";
import { FinanceKpis } from "@/ui/pages/privatePages/finance-components/FinanceKpis";
import { FinanceTable } from "@/ui/pages/privatePages/finance-components/FinanceTable";
import { TransactionModal } from "@/ui/pages/privatePages/finance-components/TransactionModal";

type FinancePageProps = {
  data: FinancePageData;
  filters: FinanceFiltersType;
};

export function FinancePage({ data, filters }: FinancePageProps) {
  const router = useRouter();
  const { notifyError, notifySuccess } = useAppFeedback();
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleMarkPaid = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await markTransactionPaidAction({ id });
      if (res?.data?.ok) {
        notifySuccess("Baixa realizada com sucesso!");
        router.refresh();
      } else {
        notifyError(res?.serverError || "Erro ao dar baixa no lançamento.");
      }
    } catch (_err) {
      notifyError("Erro inesperado ao processar baixa.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancel = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await cancelTransactionAction({ id });
      if (res?.data?.ok) {
        notifySuccess("Lançamento cancelado.");
        router.refresh();
      } else {
        notifyError(res?.serverError || "Erro ao cancelar lançamento.");
      }
    } catch (_err) {
      notifyError("Erro inesperado ao cancelar.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      {/* Cabeçalho */}
      <FinanceHeader onNewTransaction={() => setModalOpen(true)} />

      {/* Cartões de Indicadores Financeiros */}
      <FinanceKpis kpis={data.kpis} />

      {/* Barra de Filtros */}
      <FinanceFilters currentFilters={filters} />

      {/* Tabela de Lançamentos */}
      <FinanceTable
        rows={data.rows}
        loadingId={loadingId}
        onMarkPaid={handleMarkPaid}
        onCancel={handleCancel}
      />

      {/* Modal de Criação */}
      <TransactionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          router.refresh();
        }}
        accounts={data.accounts}
        categories={data.categories}
        contacts={data.contacts}
      />
    </div>
  );
}
