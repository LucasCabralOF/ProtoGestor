"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  FiCheck,
  FiSettings,
  FiUsers,
  FiX,
  FiZap,
} from "react-icons/fi";

/**
 * Checklist de ativação exibido no dashboard para contas novas.
 *
 * Aparece enquanto `isNewAccount === true` (sem clientes cadastrados).
 * O botão de dispensar esconde o bloco localmente — sem persistência em
 * banco nesta versão, pois some naturalmente assim que o primeiro
 * cliente for cadastrado.
 *
 * Tarefas: conta criada (sempre completo), cadastrar cliente, criar OS, configurar empresa.
 */

type ChecklistTask = {
  id: "account" | "client" | "service" | "settings";
  href?: string;
  done: boolean;
  icon: React.ReactNode;
};

export function OnboardingChecklist({
  hasClients,
  hasServices,
}: {
  /** conta tem pelo menos 1 cliente ativo */
  hasClients: boolean;
  /** conta tem pelo menos 1 ordem de serviço */
  hasServices: boolean;
}) {
  const t = useTranslations("onboarding.checklist");
  const [dismissed, setDismissed] = useState(false);

  const tasks: ChecklistTask[] = [
    { id: "account", done: true, icon: <FiCheck size={14} /> },
    { id: "client", href: "/clients", done: hasClients, icon: <FiUsers size={14} /> },
    { id: "service", href: "/services", done: hasServices, icon: <FiZap size={14} /> },
    { id: "settings", href: "/settings", done: false, icon: <FiSettings size={14} /> },
  ];

  const completedCount = tasks.filter((t) => t.done).length;
  const allDone = completedCount === tasks.length;

  // Se o usuário já completou tudo ou dispensou, não renderiza
  if (dismissed || allDone) return null;

  return (
    <section
      className="rounded-[28px] border border-(--color-primary)/30 bg-blue-50/60 p-5 dark:bg-blue-950/20"
      data-testid="onboarding-checklist"
      aria-labelledby="checklist-title"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            id="checklist-title"
            className="text-base font-bold text-(--color-text-1)"
          >
            {t("title")}
          </h2>
          <p className="mt-0.5 text-sm text-(--color-text-2)">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="whitespace-nowrap text-xs text-(--color-text-2)">
            {t("completed", {
              count: completedCount,
              total: tasks.length,
            })}
          </span>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label={t("dismiss")}
            className="rounded-full p-1 text-(--color-text-2) transition hover:bg-black/8 hover:text-(--color-text-1) dark:hover:bg-white/8"
            data-testid="checklist-dismiss"
          >
            <FiX size={14} />
          </button>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-(--color-border)">
        <div
          className="h-full rounded-full bg-(--color-primary) transition-all"
          style={{ width: `${(completedCount / tasks.length) * 100}%` }}
          role="progressbar"
          aria-valuenow={completedCount}
          aria-valuemin={0}
          aria-valuemax={tasks.length}
        />
      </div>

      {/* Lista de tarefas */}
      <ul className="mt-4 flex flex-col gap-2">
        {tasks.map((task) => (
          <li key={task.id}>
            {task.href && !task.done ? (
              <Link
                href={task.href}
                className="flex items-center gap-3 rounded-xl border border-(--color-border) bg-(--color-base-1) px-4 py-3 text-sm transition hover:bg-(--color-base-2) hover:no-underline"
                data-testid={`checklist-task-${task.id}`}
              >
                <span className="text-(--color-text-2)">{task.icon}</span>
                <span className="text-(--color-text-1)">
                  {t(`tasks.${task.id}`)}
                </span>
              </Link>
            ) : (
              <div
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                  task.done
                    ? "border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/20"
                    : "border-(--color-border) bg-(--color-base-1)"
                }`}
                data-testid={`checklist-task-${task.id}`}
              >
                <span
                  className={
                    task.done ? "text-emerald-600 dark:text-emerald-400" : "text-(--color-text-2)"
                  }
                >
                  {task.done ? <FiCheck size={14} /> : task.icon}
                </span>
                <span
                  className={
                    task.done
                      ? "text-emerald-700 line-through dark:text-emerald-300"
                      : "text-(--color-text-1)"
                  }
                >
                  {t(`tasks.${task.id}`)}
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
