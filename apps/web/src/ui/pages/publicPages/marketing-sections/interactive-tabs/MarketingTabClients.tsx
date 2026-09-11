import { FiMessageSquare, FiNavigation } from "react-icons/fi";

export function MarketingTabClients() {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500/10 text-base font-black text-blue-500">
            CS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold">Condomínio Solaris</h3>
              <span className="rounded bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-500">
                Recorrente Mensal
              </span>
            </div>
            <p className="text-xs text-(--color-text-2)">
              Av. Paulista, 1578 - Bela Vista, São Paulo - SP
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 transition hover:bg-emerald-500/20"
            onClick={() =>
              alert("Simulação: Abrindo WhatsApp com mensagem prévia!")
            }
            type="button"
          >
            <FiMessageSquare />
            WhatsApp
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-600 transition hover:bg-blue-500/20"
            onClick={() => alert("Simulação: Abrindo rota GPS no Waze / Maps!")}
            type="button"
          >
            <FiNavigation />
            Abrir GPS
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-(--color-border) bg-(--color-base-2) p-3.5">
          <p className="text-[11px] font-semibold text-(--color-text-2) uppercase">
            Total já faturado
          </p>
          <p className="mt-1 text-lg font-black text-(--color-text-1)">
            R$ 7.840,00
          </p>
        </div>
        <div className="rounded-lg border border-(--color-border) bg-(--color-base-2) p-3.5">
          <p className="text-[11px] font-semibold text-(--color-text-2) uppercase">
            OSs Concluídas
          </p>
          <p className="mt-1 text-lg font-black text-(--color-text-1)">
            12 atendimentos
          </p>
        </div>
        <div className="rounded-lg border border-(--color-border) bg-(--color-base-2) p-3.5">
          <p className="text-[11px] font-semibold text-(--color-text-2) uppercase">
            Próximo Retorno
          </p>
          <p className="mt-1 text-lg font-black text-blue-500">Em 15 dias</p>
        </div>
      </div>
    </div>
  );
}
