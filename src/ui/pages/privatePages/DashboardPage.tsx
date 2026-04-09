"use client";

import {
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import type { DashboardData } from "@/lib/dashboard";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";

function formatBRL(cents: number) {
  const value = cents / 100;
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function DashboardPage({
  userName,
  data,
}: {
  userName: string;
  data: DashboardData;
}) {
  const { kpis } = data;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight">
          Bem-vindo, {userName}!
        </h1>
        <p className="text-(--color-text-2)">
          Aqui está uma visão geral do seu negócio de limpeza
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border border-(--color-border)">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-(--color-text-2)">Receita Mensal</p>
              <p className="mt-1 text-3xl font-extrabold">
                {formatBRL(kpis.monthlyRevenueCents)}
              </p>
              <p className="mt-2 text-sm text-emerald-500">
                {kpis.monthlyRevenueDeltaPct >= 0 ? "+" : ""}
                {kpis.monthlyRevenueDeltaPct}% do mês passado
              </p>
            </div>
            <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-3">
              <FiDollarSign className="text-xl" />
            </div>
          </div>
        </Card>

        <Card className="border border-(--color-border)">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-(--color-text-2)">Clientes Ativos</p>
              <p className="mt-1 text-3xl font-extrabold">
                {kpis.activeClients}
              </p>
              <p className="mt-2 text-sm text-emerald-500">
                +{kpis.newClientsThisMonth} novos este mês
              </p>
            </div>
            <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-3">
              <FiUsers className="text-xl" />
            </div>
          </div>
        </Card>

        <Card className="border border-(--color-border)">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-(--color-text-2)">
                Serviços Esta Semana
              </p>
              <p className="mt-1 text-3xl font-extrabold">
                {kpis.servicesThisWeek}
              </p>
              <p className="mt-2 text-sm text-(--color-text-2)">
                {kpis.servicesCompletedThisWeek} concluídos,{" "}
                {Math.max(
                  0,
                  kpis.servicesThisWeek - kpis.servicesCompletedThisWeek,
                )}{" "}
                pendentes
              </p>
            </div>
            <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-3">
              <FiCalendar className="text-xl" />
            </div>
          </div>
        </Card>

        <Card className="border border-(--color-border)">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-(--color-text-2)">
                Taxa de Crescimento
              </p>
              <p className="mt-1 text-3xl font-extrabold">
                {kpis.monthlyRevenueDeltaPct}%
              </p>
              <p className="mt-2 text-sm text-emerald-500">
                {kpis.monthlyRevenueDeltaPct >= 0 ? "+" : ""}
                {kpis.monthlyRevenueDeltaPct}% do mês passado
              </p>
            </div>
            <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-3">
              <FiTrendingUp className="text-xl" />
            </div>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="border border-(--color-border)">
          <h2 className="text-xl font-bold">Atividade Recente</h2>
          <div className="mt-4">
            {data.recentActivity.length === 0 ? (
              <p className="py-10 text-center text-(--color-text-2)">
                Nenhuma atividade recente
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {data.recentActivity.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-xl border border-(--color-border) bg-(--color-base-2) p-3"
                  >
                    <p className="text-sm">{a.message}</p>
                    <p className="mt-1 text-xs text-(--color-text-2)">
                      {new Date(a.createdAt).toLocaleString("pt-BR")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card className="border border-(--color-border)">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Próximos Serviços</h2>
            <Button type="default">Ver Todos</Button>
          </div>

          <div className="mt-4">
            {data.upcomingServices.length === 0 ? (
              <p className="py-10 text-center text-(--color-text-2)">
                Nenhum serviço agendado
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {data.upcomingServices.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-xl border border-(--color-border) bg-(--color-base-2) p-3"
                  >
                    <p className="font-semibold">{s.title}</p>
                    <p className="mt-1 text-sm text-(--color-text-2)">
                      {s.customerName ? `${s.customerName} • ` : ""}
                      {new Date(s.startsAt).toLocaleString("pt-BR")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
