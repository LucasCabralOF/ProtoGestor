import { FiCalendar, FiCheck, FiCreditCard, FiDownload } from "react-icons/fi";
import type { SubscriptionInvoice } from "@/lib/subscription-utils";

type SubscriptionInvoiceHistoryProps = {
  invoices: SubscriptionInvoice[];
};

export function SubscriptionInvoiceHistory({
  invoices,
}: SubscriptionInvoiceHistoryProps) {
  return (
    <div className="mt-8 rounded-2xl border border-(--color-border) bg-(--color-base-2) p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FiCreditCard className="text-(--color-primary)" />
          <h3 className="text-sm font-bold">Histórico de Cobranças do SaaS</h3>
        </div>
        <span className="text-xs text-(--color-text-2)">
          Faturamento automatizado
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex flex-col gap-2 rounded-xl border border-(--color-border) bg-(--color-base-1) p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs font-bold text-(--color-text-1)">
                {invoice.description}
              </p>
              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-(--color-text-2)">
                <span className="inline-flex items-center gap-1">
                  <FiCalendar className="h-3 w-3" />
                  {invoice.date}
                </span>
                <span>•</span>
                <span className="font-semibold text-(--color-text-1)">
                  {invoice.amount}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                <FiCheck className="h-3 w-3" />
                Pago
              </span>
              <button
                className="inline-flex items-center gap-1 rounded-lg border border-(--color-border) px-2.5 py-1 text-[11px] font-semibold text-(--color-text-2) transition hover:bg-(--color-base-2)"
                onClick={() =>
                  alert(`Download do recibo da fatura ${invoice.id} gerado!`)
                }
                type="button"
              >
                <FiDownload className="h-3 w-3" />
                Recibo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
