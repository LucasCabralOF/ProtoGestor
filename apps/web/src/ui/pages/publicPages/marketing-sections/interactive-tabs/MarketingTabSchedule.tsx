import { FiClock } from "react-icons/fi";

export function MarketingTabSchedule() {
  const scheduleItems = [
    {
      time: "08:30",
      client: "Hospital Santa Lúcia",
      tech: "Marcos Lima",
      status: "Concluído",
      badge: "bg-emerald-500/10 text-emerald-500",
    },
    {
      time: "11:00",
      client: "Residencial Jardins",
      tech: "Ana Souza",
      status: "Em Atendimento",
      badge: "bg-amber-500/10 text-amber-500",
    },
    {
      time: "14:30",
      client: "Clínica Vida Ativa",
      tech: "Carlos Mendes",
      status: "Agendado",
      badge: "bg-blue-500/10 text-blue-500",
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-(--color-text-2)">
          Visitas de Hoje • 4 agendamentos
        </p>
        <span className="rounded bg-blue-500/10 px-2.5 py-1 text-xs font-bold text-blue-500">
          Fuso America/Sao_Paulo
        </span>
      </div>

      <div className="space-y-2.5">
        {scheduleItems.map((item) => (
          <div
            key={item.client}
            className="flex items-center justify-between rounded-lg border border-(--color-border) bg-(--color-base-2) p-3.5"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-(--color-primary)">
                <FiClock className="h-3.5 w-3.5" />
                {item.time}
              </span>
              <div>
                <p className="text-sm font-bold">{item.client}</p>
                <p className="text-xs text-(--color-text-2)">
                  Técnico: {item.tech}
                </p>
              </div>
            </div>
            <span
              className={`rounded px-2.5 py-0.5 text-xs font-bold ${item.badge}`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
