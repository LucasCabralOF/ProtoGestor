import Link from "next/link";
import type { ReactNode } from "react";
import {
  FiActivity,
  FiArrowRight,
  FiBriefcase,
  FiClock,
  FiFilter,
  FiFolder,
  FiLayers,
  FiSearch,
  FiSettings,
  FiTarget,
  FiUsers,
} from "react-icons/fi";
import type { ProjectRow, ProjectsPageData } from "@/lib/projects";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";

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
      "Abra a operação detalhada para editar escopo, status e agendamentos.",
    href: "/services",
    icon: <FiBriefcase />,
    label: "Serviços",
  },
  {
    description: "Acompanhe indicadores gerais e capacidade do tenant ativo.",
    href: "/dashboard",
    icon: <FiArrowRight />,
    label: "Dashboard",
  },
  {
    description:
      "Ajuste idioma e aparência do painel antes de alinhar o fluxo com o time.",
    href: "/settings",
    icon: <FiSettings />,
    label: "Configurações",
  },
] as const;

function toneClass(tone: ProjectRow["statusTone"]) {
  const base =
    "inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold";

  if (tone === "success") {
    return `${base} border-emerald-500/20 bg-emerald-500/10 text-emerald-400`;
  }

  if (tone === "warning") {
    return `${base} border-amber-500/20 bg-amber-500/10 text-amber-400`;
  }

  if (tone === "danger") {
    return `${base} border-rose-500/20 bg-rose-500/10 text-rose-400`;
  }

  if (tone === "accent") {
    return `${base} border-sky-500/20 bg-sky-500/10 text-sky-400`;
  }

  return `${base} border-(--color-border) bg-(--color-base-2) text-(--color-text-2)`;
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="border border-(--color-border)">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-(--color-text-2)">{label}</p>
          <p className="mt-2 text-3xl font-extrabold">{value}</p>
        </div>

        <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-3 text-lg">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function ProjectsPage({
  data,
  filters,
  orgName,
  userName,
}: {
  data: ProjectsPageData;
  filters: {
    q: string;
    stage:
      | "all"
      | "scoping"
      | "planned"
      | "execution"
      | "delivery"
      | "archived";
  };
  orgName: string;
  userName: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-black tracking-tight">Projetos</h1>
          <p className="mt-1 text-(--color-text-2)">
            {userName}, aqui está a visão operacional de {orgName}: escopo,
            andamento, próximos marcos e links rápidos para execução sem sair do
            tenant ativo.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/services">
            <Button fit type="primary">
              Abrir serviços
            </Button>
          </Link>

          <Link href="/clients">
            <Button fit type="default">
              Ver clientes
            </Button>
          </Link>
        </div>
      </header>

      <Card className="border border-(--color-border)">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
              <FiClock />
              Fluxo ativo
            </div>

            <h2 className="mt-4 text-2xl font-extrabold">
              Um cockpit para transformar serviços em entregas acompanháveis
            </h2>
            <p className="mt-2 text-(--color-text-2)">
              A tela agora consolida pipeline, receita projetada, marcos e
              pontos de atenção. O dado continua vindo do servidor com base na
              organização ativa e sem depender de `orgId` enviado pelo client.
            </p>
          </div>

          <div className="rounded-3xl border border-(--color-border) bg-(--color-base-2) p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-(--color-border) bg-(--color-base-1) p-3">
                <FiFolder className="text-2xl" />
              </div>
              <div>
                <p className="text-sm text-(--color-text-2)">Projetos ativos</p>
                <p className="text-lg font-bold">{data.kpis.active}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          icon={<FiLayers />}
          label="Projetos no tenant"
          value={data.kpis.total}
        />
        <SummaryCard
          icon={<FiActivity />}
          label="Em andamento"
          value={data.kpis.active}
        />
        <SummaryCard
          icon={<FiTarget />}
          label="Concluídos"
          value={data.kpis.completed}
        />
        <SummaryCard
          icon={<FiClock />}
          label="Próximas visitas"
          value={data.kpis.upcomingVisits}
        />
        <SummaryCard
          icon={<FiUsers />}
          label="Clientes atendidos"
          value={data.kpis.customerCount}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="border border-(--color-border)">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-bold">Pipeline do módulo</h2>
              <p className="text-sm text-(--color-text-2)">
                Receita projetada atual: {data.kpis.projectedRevenueLabel}
              </p>
            </div>

            <form
              className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_180px_auto]"
              method="get"
            >
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-(--color-text-2)">Buscar</span>
                <div className="flex items-center gap-2 rounded-2xl border border-(--color-border) bg-(--color-base-2) px-3 py-2">
                  <FiSearch className="shrink-0 text-(--color-text-2)" />
                  <input
                    className="w-full bg-transparent text-sm outline-none placeholder:text-(--color-text-2)"
                    defaultValue={filters.q}
                    name="q"
                    placeholder="Projeto, cliente ou descrição"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1 text-sm">
                <span className="text-(--color-text-2)">Etapa</span>
                <div className="flex items-center gap-2 rounded-2xl border border-(--color-border) bg-(--color-base-2) px-3 py-2">
                  <FiFilter className="shrink-0 text-(--color-text-2)" />
                  <select
                    className="w-full bg-transparent text-sm outline-none"
                    defaultValue={filters.stage}
                    name="stage"
                  >
                    <option value="all">Todas</option>
                    <option value="scoping">Escopo</option>
                    <option value="planned">Planejamento</option>
                    <option value="execution">Execução</option>
                    <option value="delivery">Entrega</option>
                    <option value="archived">Arquivo</option>
                  </select>
                </div>
              </label>

              <div className="flex gap-2">
                <Button fit htmlType="submit" type="primary">
                  Filtrar
                </Button>
                <Link href="/projects">
                  <Button fit type="default">
                    Limpar
                  </Button>
                </Link>
              </div>
            </form>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2 2xl:grid-cols-5">
            {data.lanes.map((lane) => (
              <div
                key={lane.stage}
                className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{lane.label}</p>
                    <p className="mt-1 text-sm text-(--color-text-2)">
                      {lane.description}
                    </p>
                  </div>
                  <div className="rounded-full border border-(--color-border) bg-(--color-base-1) px-3 py-1 text-sm font-bold">
                    {lane.count}
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

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="border border-(--color-border)">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Projetos do momento</h2>
              <p className="text-sm text-(--color-text-2)">
                A lista abaixo respeita os filtros atuais da página.
              </p>
            </div>
            <Link href="/services">
              <Button fit type="default">
                Gerenciar no módulo de serviços
              </Button>
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {data.rows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-(--color-border) bg-(--color-base-2) p-6 text-sm text-(--color-text-2)">
                Nenhum projeto encontrado com os filtros atuais.
              </div>
            ) : (
              data.rows.map((row) => (
                <div
                  key={row.id}
                  className="rounded-3xl border border-(--color-border) bg-(--color-base-2) p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold">{row.title}</h3>
                        <span className={toneClass(row.statusTone)}>
                          {row.statusLabel}
                        </span>
                        <span className="inline-flex items-center rounded-full border border-(--color-border) bg-(--color-base-1) px-2 py-1 text-xs font-semibold text-(--color-text-2)">
                          {row.stageLabel}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-(--color-text-2)">
                        {row.description ||
                          "Sem descrição registrada até aqui."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link href={row.detailHref}>
                        <Button fit type="primary">
                          Abrir fluxo
                        </Button>
                      </Link>

                      {row.customerHref ? (
                        <Link href={row.customerHref}>
                          <Button fit type="default">
                            Ver cliente
                          </Button>
                        </Link>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-2)">
                        Cliente
                      </p>
                      <p className="mt-1 font-semibold">
                        {row.customerName || "Cliente pendente"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-2)">
                        Valor previsto
                      </p>
                      <p className="mt-1 font-semibold">{row.valueLabel}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-2)">
                        Próximo marco
                      </p>
                      <p className="mt-1 font-semibold">{row.scheduleLabel}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-2)">
                        Responsável
                      </p>
                      <p className="mt-1 font-semibold">{row.ownerLabel}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-(--color-text-2)">
                        Progresso estimado
                      </span>
                      <span className="font-semibold">{row.progressPct}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-(--color-base-1)">
                      <div
                        className="h-2 rounded-full bg-linear-to-r from-sky-500 to-emerald-400"
                        style={{ width: `${row.progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 text-sm text-(--color-text-2) lg:flex-row lg:items-center lg:justify-between">
                    <p>Próxima ação: {row.nextStepLabel}</p>
                    <p>Atualizado em {row.updatedAtLabel}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="grid gap-4">
          <Card className="border border-(--color-border)">
            <h2 className="text-xl font-bold">Pontos de atenção</h2>
            <div className="mt-4 grid gap-3">
              {data.attentionItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-(--color-border) bg-(--color-base-2) p-4 text-sm text-(--color-text-2)">
                  Nenhum item crítico no recorte atual.
                </div>
              ) : (
                data.attentionItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4"
                  >
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-(--color-text-2)">
                      {item.description}
                    </p>

                    <div className="mt-3">
                      <Link href={item.href}>
                        <Button fit type="default">
                          {item.hrefLabel}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="border border-(--color-border)">
            <h2 className="text-xl font-bold">Atividade recente</h2>
            <div className="mt-4 grid gap-3">
              {data.recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-4"
                >
                  <p className="font-medium">{item.message}</p>
                  <p className="mt-1 text-sm text-(--color-text-2)">
                    {item.createdAtLabel}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
