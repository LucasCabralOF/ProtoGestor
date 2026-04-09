import Link from "next/link";
import {
  FiArrowRight,
  FiClock,
  FiFolder,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";

const ROADMAP = [
  {
    description: "Cadastro do projeto, cliente responsável e escopo inicial.",
    title: "Briefing e kick-off",
  },
  {
    description: "Etapas, responsáveis, prazos e status operacional.",
    title: "Planejamento e execução",
  },
  {
    description: "Checklist, anexos, observações e entregáveis finais.",
    title: "Acompanhamento da entrega",
  },
];

const SHORTCUTS = [
  {
    description:
      "Use a base de clientes atual para definir responsáveis e contatos.",
    href: "/clients",
    icon: <FiUsers />,
    label: "Clientes",
  },
  {
    description:
      "Acompanhe indicadores do negócio enquanto o módulo de projetos entra no ar.",
    href: "/dashboard",
    icon: <FiArrowRight />,
    label: "Dashboard",
  },
  {
    description:
      "Ajuste idioma e aparência do painel antes de expandir o fluxo.",
    href: "/settings",
    icon: <FiSettings />,
    label: "Configurações",
  },
] as const;

export function ProjectsPage({
  orgName,
  userName,
}: {
  orgName: string;
  userName: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight">Projetos</h1>
        <p className="text-(--color-text-2)">
          {userName}, este módulo ainda está em preparação para {orgName}. A
          navegação agora está pronta e podemos evoluir a entrega sem links
          quebrados.
        </p>
      </header>

      <Card className="border border-(--color-border)">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              <FiClock />
              Em implantação
            </div>

            <h2 className="mt-4 text-2xl font-extrabold">
              Estrutura pronta para o próximo ciclo do produto
            </h2>
            <p className="mt-2 text-(--color-text-2)">
              A base já tem autenticação, organização, clientes e dashboard. O
              próximo passo natural é transformar projetos em um fluxo com
              escopo, etapas, responsáveis e progresso.
            </p>
          </div>

          <div className="rounded-3xl border border-(--color-border) bg-(--color-base-2) p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-(--color-border) bg-(--color-base-1) p-3">
                <FiFolder className="text-2xl" />
              </div>
              <div>
                <p className="text-sm text-(--color-text-2)">Status atual</p>
                <p className="text-lg font-bold">Pronto para modelar</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="border border-(--color-border)">
          <h2 className="text-xl font-bold">Roadmap Inicial</h2>
          <div className="mt-4 grid gap-3">
            {ROADMAP.map((item, index) => (
              <div
                key={item.title}
                className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-(--color-border) bg-(--color-base-1) text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-(--color-text-2)">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border border-(--color-border)">
          <h2 className="text-xl font-bold">Atalhos Úteis</h2>
          <div className="mt-4 grid gap-3">
            {SHORTCUTS.map((shortcut) => (
              <div
                key={shortcut.href}
                className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-(--color-border) bg-(--color-base-1) p-3">
                    {shortcut.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold">{shortcut.label}</p>
                    <p className="mt-1 text-sm text-(--color-text-2)">
                      {shortcut.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link href={shortcut.href}>
                    <Button fit type="default">
                      Abrir {shortcut.label}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
