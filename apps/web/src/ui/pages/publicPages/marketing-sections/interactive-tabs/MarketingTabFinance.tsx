import { useState } from "react";
import { FiCheck } from "react-icons/fi";

export function MarketingTabFinance() {
  const [invoicePaid, setInvoicePaid] = useState(false);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
          <p className="text-[10px] font-bold uppercase text-emerald-600">
            Recebido no Mês
          </p>
          <p className="mt-1 text-base font-black text-emerald-600">
            R$ 8.940,00
          </p>
        </div>
        <div className="rounded-lg border border-emerald-600/20 bg-emerald-600/10 p-3">
          <p className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
            A Receber
          </p>
          <p className="mt-1 text-base font-black text-emerald-700 dark:text-emerald-400">
            {invoicePaid ? "R$ 1.950,00" : "R$ 2.430,00"}
          </p>
        </div>
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
          <p className="text-[10px] font-bold uppercase text-amber-600">
            Em Atraso
          </p>
          <p className="mt-1 text-base font-black text-amber-600">R$ 0,00</p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-(--color-border) bg-(--color-base-2) p-4">
        <div>
          <p className="text-sm font-bold">
            Ordem de Serviço #204 - Residencial Bela Vista
          </p>
          <p className="text-xs text-(--color-text-2)">
            Vencimento: Hoje • Valor: R$ 480,00
          </p>
        </div>

        {invoicePaid ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-500">
            <FiCheck />
            Baixado / Pago
          </span>
        ) : (
          <button
            className="inline-flex items-center gap-1 rounded-md bg-(--color-primary) px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:brightness-110"
            onClick={() => setInvoicePaid(true)}
            type="button"
          >
            <FiCheck />
            Dar Baixa
          </button>
        )}
      </div>
    </div>
  );
}
