"use client";

import { useState } from "react";
import { FiCalendar, FiDollarSign, FiFileText, FiUsers } from "react-icons/fi";
import { MarketingTabClients } from "./interactive-tabs/MarketingTabClients";
import { MarketingTabFinance } from "./interactive-tabs/MarketingTabFinance";
import { MarketingTabOrders } from "./interactive-tabs/MarketingTabOrders";
import { MarketingTabSchedule } from "./interactive-tabs/MarketingTabSchedule";

type ModuleTab = "clients" | "schedule" | "orders" | "finance";

export function MarketingInteractiveModules() {
  const [activeTab, setActiveTab] = useState<ModuleTab>("clients");

  return (
    <section
      className="rounded-xl border border-(--color-border) bg-white p-4 sm:p-6 shadow-sm dark:bg-(--color-base-1) lg:p-8"
      data-testid="marketing-interactive-modules"
    >
      <div className="flex flex-col gap-2.5 sm:gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--color-primary)">
            Módulos Operacionais
          </p>
          <h2 className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
            A operação completa na prática
          </h2>
        </div>
        <p className="max-w-md text-xs sm:text-sm text-(--color-text-2)">
          Clique nas abas abaixo para explorar como cada módulo resolve o dia a
          dia da sua equipe sem complicação.
        </p>
      </div>

      {/* Selector de Abas */}
      <div className="mt-5 sm:mt-8 flex flex-wrap gap-1.5 sm:gap-2 rounded-lg border border-(--color-border) bg-(--color-base-2) p-1.5">
        {[
          { id: "clients", label: "Ficha 360° do Cliente", icon: FiUsers },
          { id: "schedule", label: "Agenda & Visitas", icon: FiCalendar },
          { id: "orders", label: "Ordens de Serviço", icon: FiFileText },
          { id: "finance", label: "Financeiro & Baixa", icon: FiDollarSign },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-md px-3 py-1.5 text-xs font-bold transition-all sm:px-4 sm:py-2 sm:text-sm ${
                isActive
                  ? "bg-(--color-primary) text-white shadow-sm"
                  : "text-(--color-text-2) hover:bg-(--color-base-1) hover:text-(--color-text-1)"
              }`}
              onClick={() => setActiveTab(tab.id as ModuleTab)}
              type="button"
            >
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Conteúdo Interativo Dinâmico */}
      <div className="mt-4 sm:mt-6 rounded-lg border border-(--color-border) bg-(--color-base-1) p-3.5 sm:p-6 shadow-sm">
        {activeTab === "clients" && <MarketingTabClients />}
        {activeTab === "schedule" && <MarketingTabSchedule />}
        {activeTab === "orders" && <MarketingTabOrders />}
        {activeTab === "finance" && <MarketingTabFinance />}
      </div>
    </section>
  );
}
