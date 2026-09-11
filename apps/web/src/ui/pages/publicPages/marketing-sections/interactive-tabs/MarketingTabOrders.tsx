import { useState } from "react";

export function MarketingTabOrders() {
  const [osStatus, setOsStatus] = useState("Concluída");

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-xs font-bold text-(--color-primary)">
            OS #204
          </span>
          <h3 className="text-base font-bold">
            Manutenção Preventiva e Troca de Filtros
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-(--color-text-2)">Status:</span>
          <select
            aria-label="Status da OS"
            className="rounded-md border border-(--color-border) bg-(--color-base-2) px-3 py-1.5 text-xs font-bold text-(--color-text-1)"
            onChange={(e) => setOsStatus(e.target.value)}
            value={osStatus}
          >
            <option value="Agendada">Agendada</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Concluída">Concluída</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-(--color-border) bg-(--color-base-2) p-4">
        <div className="flex items-center justify-between text-xs text-(--color-text-2)">
          <span>Item do Atendimento</span>
          <span>Subtotal</span>
        </div>
        <div className="mt-2 space-y-1.5 text-sm">
          <div className="flex justify-between font-medium">
            <span>Revisão técnica de 4 evaporadoras</span>
            <span>R$ 480,00</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Troca de carga de fluido refrigerante</span>
            <span>R$ 200,00</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-(--color-border) pt-2 text-sm font-bold">
          <span>Total da OS</span>
          <span className="text-base font-black text-emerald-500">
            R$ 680,00
          </span>
        </div>
      </div>
    </div>
  );
}
