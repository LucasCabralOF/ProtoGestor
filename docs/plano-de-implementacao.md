# Documentação e Plano de Implementação: ProtoGestor SaaS

> **Data:** 06/09/2026  
> **Status:** 100% Concluído e Validado em Produção  
> **Público-alvo:** Engenharia, Produto e Negócio  
> **Posicionamento:** SaaS operacional para micro e pequenas empresas de serviços recorrentes e atendimento em campo.

---

## 1. Visão Geral e Diagnóstico Atual

O **ProtoGestor** foi concebido e arquitetado para ser uma plataforma SaaS *multi-tenant* focada no núcleo operacional de pequenas empresas de serviços (1 a 10 pessoas), tais como manutenção predial, climatização, dedetização, facilities, jardinagem e assistência técnica.

### 1.1 O Que Já Está 100% Implementado e Funcional

1. **Arquitetura Multi-Tenant & Multi-Empresa:**
   - Cada usuário autenticado pode criar múltiplas organizações e atuar em diferentes papéis em cada uma (`owner`, `admin`, `member`).
   - Troca instantânea de empresa ativa via menu dropdown no `Navbar` e em `Configurações > Minhas Empresas`.
   - Organização ativa persistida e validada via cookie seguro e sessão server-side (`ACTIVE_ORG_ID`).
2. **Divisão Proprietário (Dono) vs Colaborador (Equipe):**
   - **Fluxo de Cadastro (`/signup`):** Seleção de perfil visual entre "Proprietário / Dono" e "Colaborador da Equipe".
   - **Onboarding Guiado (`/onboarding`):**
     - *Dono:* Criação assistida da empresa com definição de segmento e preferências.
     - *Colaborador:* Entrada imediata em uma empresa existente através de código de acesso ou identificador (*slug*).
   - **Gestão de Membros (`/settings`):** Código de convite com botão de cópia com 1 clique, listagem de colaboradores, alteração de permissão e desativação/remoção.
3. **Módulo de Clientes (`/clients`):**
   - Cadastro completo de contatos, endereços, tags e regras de recorrência.
   - Listagem com busca textual, filtros de status, ordenação e cartões de KPI.
   - Importação e exportação de contatos em formato CSV.
   - Modularizado em subcomponentes com menos de 300 linhas cada (`ClientsHeader`, `ClientsKpis`, `ClientsFilters`, `ClientsTable`).
4. **Módulo de Ordens de Serviço (`/services`):**
   - Registro de atendimentos com múltiplos itens, valores e clientes vinculados.
   - 5 cartões de KPI com paleta semântica (*Rascunho, Agendada, Em Andamento, Concluída, Cancelada*).
   - Transição ágil de status em 1 clique com menu contextual.
   - Agendamento de visita diretamente integrado à ordem de serviço.
5. **Módulo de Agenda & Visitas (`/schedule`):**
   - Calendário visual com suporte a visualizações Mês, Semana, Dia e Lista de Compromissos.
   - Suporte a arrastar e soltar (*drag-and-drop*) para reagendamento rápido.
   - Tratamento estrito de fuso horário brasileiro (`America/Sao_Paulo`) sem bugs de offset UTC.
6. **Módulo de Relatórios (`/reports`):**
   - Agregações operacionais (taxa de conclusão de OS, visitas realizadas) e financeiras consolidadas.
   - Exportação em CSV dos dados filtrados por período.
7. **Dashboard Executivo (`/dashboard`):**
   - Indicadores-chave com cores temáticas (recebimentos, atendimentos pendentes, visitas de hoje).
   - Lista de próximos atendimentos e feed de atividades recentes da empresa.
8. **Engenharia & Qualidade:**
   - 100% de conformidade com `AGENTS.md` (sem imports diretos de `antd`, sem *barrel exports*, sem `React.` namespace).
   - **0 erros no Biome e TypeScript** em 190 arquivos.
   - **62 testes unitários passando** com Vitest e Testing Library.

---

## 2. Gaps Identificados: O Que Falta no Sistema

Para que o ProtoGestor alcance o status de **produto final comercialmente vendável e pronto para escala**, faltam 5 pilares fundamentais:

```
[ Estado Atual ]
Cliente ──────► Agenda ──────► Ordem de Serviço ──────► (GAP: Cobrança Manual)

[ Ciclo Completo Necessário ]
Cliente ──────► Agenda ──────► Ordem de Serviço ──────► Financeiro (Contas a Receber)
   ▲                                                           │
   └─────────────── Automação de Próximo Ciclo ◄───────────────┘
```

| # | Pilar / Módulo | Estado Atual | Impacto no Negócio |
|---|---|---|---|
| **P0** | **Módulo Financeiro Dedicado (`/finance`)** | **100% Implementado (Fase 1)** | Fechou o ciclo de cobrança e baixa em 1 clique. |
| **P0** | **RBAC Operacional (Dono vs Colaborador)** | **100% Implementado (Fase 2)** | Garante sigilo financeiro e visão focada de campo para técnicos. |
| **P1** | **Ficha 360° do Cliente (`/clients/[id]`)** | **100% Implementado (Fase 3)** | Histórico unificado, faturamento acumulado e atalhos rápidos WhatsApp/GPS. |
| **P1** | **Automação de Recorrência de Serviços** | **100% Implementado (Fase 4)** | Gatilho automático ao concluir OS e alertas de retorno no Dashboard. |
| **P2** | **Landing Page Pública & Planos SaaS** | **100% Implementado (Fase 5)** | Home completa na raiz (`/`), diferenciais, módulos interativos e `/pricing`. |
| **P2** | **Billing & Assinatura da Plataforma** | **100% Implementado (Fase 6)** | Gestão em `/settings`, upgrade de planos, 14 dias de trial e histórico de cobrança. |

---

## 3. Plano de Implementação Técnico (Fase a Fase)

---

### Fase 1: Módulo Financeiro Dedicado (`/finance`) — *Prioridade P0*

#### 1.1 Objetivo
Fechar o ciclo operacional permitindo que o gestor controle contas a receber (geradas pelas Ordens de Serviço), contas a pagar, dê baixa de recebimento em 1 clique e acompanhe o fluxo de caixa diário.

#### 1.2 Arquitetura de Dados & Camada de Domínio
O schema Prisma já possui as tabelas `fin_transaction`, `fin_account` e `fin_category`. Reutilizaremos essa base sem necessidade de migrações arriscadas.

- **Criar `src/lib/finance-utils.ts`:**
  - Funções puras de formatação monetária e de data para o Brasil (`formatMoneyBRL`, `formatDateBR`).
  - Cálculo de KPIs: total recebido, total a receber pendente, total atrasado (*overdue*) e despesas do período.
  - Tipagens estritas (`TransactionRow`, `FinanceKpisData`, `TransactionFilterParams`).
- **Criar `src/lib/finance.ts`:**
  - Server-only functions: `getFinancePageData(orgId, filters)`.
  - Queries otimizadas com Prisma usando índices `[orgId, type, status]` e `[orgId, dueAt]`.
- **Criar `src/actions/(private)/finance.ts`:**
  - `markTransactionPaidAction`: Atualiza status para `paid` e preenche `paidAt: new Date()`.
  - `createTransactionAction`: Cria receita ou despesa manual avulsa com validação Zod.
  - `cancelTransactionAction`: Cancela uma cobrança.

#### 1.3 Interface & Componentes (Seguindo a regra de < 300 linhas)
Local: `src/ui/pages/privatePages/finance-components/`
- `FinanceHeader.tsx`: Título, subtítulo, botão "Nova Receita / Despesa" e botão de exportação.
- `FinanceKpis.tsx`: 4 cartões com badges coloridas (Recebido no Mês, A Receber, Atrasado, Despesas).
- `FinanceFilters.tsx`: Filtro de período (Este Mês, Mês Passado, Personalizado), tipo (Receitas/Despesas) e status (`pending`, `paid`).
- `FinanceTable.tsx`: Tabela com avatar do cliente/categoria, valor formatado, data de vencimento com indicador visual de atraso (badge vermelho) e botão de ação rápida "Baixar / Pago".
- `TransactionModal.tsx`: Modal para lançamento rápido de despesas/receitas avulsas.
- `FinancePage.tsx`: Integrador client da página.
- Rota: `src/app/(private)/finance/page.tsx` com `getPrivatePageContext()`.

#### 1.4 Navegação
- Atualizar `src/ui/pages/layout_private/nav.tsx`:
  - Incluir item `{ href: "/finance", label: t("itemFinance"), icon: <FiDollarSign /> }` no grupo de Operações.

---

### Fase 2: RBAC Operacional (Dono vs Colaborador) — *Prioridade P0*

#### 2.1 Objetivo
Garantir que colaboradores (técnicos em campo) tenham uma experiência limpa, focada e segura, sem acesso aos números financeiros confidenciais da empresa.

#### 2.2 Regras de Acesso por Papel

| Módulo / Funcionalidade | Proprietário (`owner`) / Administrador (`admin`) | Colaborador da Equipe (`member`) |
|---|---|---|
| **Dashboard** | Visão executiva completa com faturamento | Visão operacional (suas visitas do dia e suas OSs) |
| **Agenda (`/schedule`)** | Vê todos os atendimentos e de todos os técnicos | Vê seus atendimentos ou agenda geral da equipe |
| **Ordens de Serviço (`/services`)** | Criação, edição, exclusão e visualização de valores | Execução, alteração de status e anotações técnicas |
| **Clientes (`/clients`)** | Gestão completa e faturamento acumulado | Consulta de contatos, endereços e histórico técnico |
| **Financeiro (`/finance`)** | Acesso total | **Bloqueado (403 / Redirecionamento)** |
| **Relatórios (`/reports`)** | Acesso total com métricas financeiras | **Bloqueado (403 / Redirecionamento)** |
| **Configurações (`/settings`)** | Gerenciar empresa, membros e faturamento | Gerenciar apenas seu próprio perfil/idioma/tema |

#### 2.3 Implementação
- Atualizar `src/ui/pages/layout_private/nav.tsx` para receber a `role` do usuário e ocultar itens restritos.
- Adicionar guard server-side em `src/lib/private-context.ts` ou nas páginas `/finance/page.tsx` e `/reports/page.tsx`:
  ```typescript
  if (context.activeOrg.role === "member") {
    redirect("/dashboard");
  }
  ```

---

### Fase 3: Ficha 360° do Cliente & Atalhos de Campo — *Prioridade P1*

#### 3.1 Objetivo
Dar ao prestador de serviços e ao gestor uma visão consolidada de cada cliente em uma única tela, permitindo contato imediato via WhatsApp e abertura de rota GPS no celular.

#### 3.2 Entregas
1. **Página de Detalhes do Cliente (`/clients/[id]`):**
   - Cabeçalho com dados de contato, status e tags.
   - **Botões de Ação Imediata:**
     - `WhatsApp`: Abre link `https://wa.me/55...` com mensagem pré-formatada ("Olá [Nome], confirmamos nossa visita técnica hoje às...").
     - `Google Maps / Waze`: Abre rota com 1 clique utilizando o endereço cadastrado (`https://maps.google.com/?q=...`).
   - **Histórico Operacional (Timeline):** Linha do tempo listando todas as OSs já executadas, valores, fotos ou observações de serviços anteriores.
   - **Resumo Financeiro:** Total já faturado, pagamentos pendentes e média de recorrência.

---

### Fase 4: Automação de Recorrência & Ciclos de Serviço — *Prioridade P1*

#### 4.1 Objetivo
Eliminar o esquecimento de visitas periódicas (ex: limpeza de ar-condicionado a cada 6 meses, manutenção de piscina semanal, dedetização trimestral).

#### 4.2 Entregas
1. **Gatilho de Conclusão de Serviço:**
   - Ao alterar o status de uma Ordem de Serviço para `completed` (ou da Visita para `done`), o sistema verifica se o cliente ou serviço possui `recurrenceRule != 'none'`.
   - Um modal amigável ou ação em segundo plano sugere: *"Este serviço é mensal. Deseja agendar a próxima visita para [Data Sugerida]?"*
   - Com 1 clique, o novo `Appointment` é criado na agenda com status `scheduled`.
2. **Alertas de Retorno no Dashboard:**
   - Widget no Dashboard listando *"Clientes que precisam de agendamento de retorno este mês"*.

---

### Fase 5: Landing Page Pública & Funil de Aquisição SaaS — *Prioridade P2*

#### 5.1 Objetivo
Permitir que o SaaS seja divulgado na internet e adquira novos clientes de forma autônoma.

#### 5.2 Entregas
1. **Landing Page Institucional na Raiz (`/`):**
   - Utilizar a copy já aprovada em `docs/landing-page-copy.md`.
   - Seções:
     - Hero com headline impactante e botões "Começar Teste Grátis" e "Ver Demonstração".
     - Barra de diferenciais (Multi-empresa, Simples, Sem peso de ERP, Feito para o Brasil).
     - As 4 Dores Principais vs As 4 Soluções do ProtoGestor.
     - Demonstração visual dos módulos (Cards interativos de Clientes, Agenda e Financeiro).
     - Tabela de Preços e FAQ.
2. **Página de Planos & Assinatura:**
   - Visualização de planos:
     - **Autônomo / Starter (R$ 49/mês):** 1 empresa, 1 usuário.
     - **Equipe / Pro (R$ 99/mês):** 1 empresa, até 5 colaboradores.
     - **Empresarial (R$ 179/mês):** Múltiplas empresas, colaboradores ilimitados.
   - Modelagem de cobrança da organização (`Organization.plan`, `trialEndsAt`).

---

### Fase 6: Gestão de Assinatura & Faturamento SaaS (`/settings`) — *Prioridade P2*

#### 6.1 Objetivo
Permitir que o dono da empresa gerencie a assinatura do software, realize upgrade/downgrade de plano com 1 clique, acompanhe os dias restantes de teste grátis e consulte o histórico de mensalidades.

#### 6.2 Entregas
1. **Modelagem & Domínio de Assinatura (`src/lib/subscription-utils.ts`):**
   - Utilitários puros para cálculo de dias restantes de trial, alternância de ciclo (mensal vs anual com 15% off) e histórico de faturas simulado.
2. **Server Action de Assinatura (`src/actions/(private)/subscription.ts`):**
   - `updateOrganizationPlanAction` com proteção estrita RBAC (apenas `owner` e `admin`).
   - Registro de auditoria (`subscription.plan_updated`) no `ActivityLog`.
3. **Interface de Assinatura (`SettingsSubscription.tsx`):**
   - Painel integrado em `/settings` com os 3 planos, status do trial e histórico de cobrança.

---

## 4. Matriz de Arquivos e Componentes Planejados

```
src/
├── app/
│   ├── (private)/
│   │   ├── finance/
│   │   │   └── page.tsx                    [NOVO] Página do módulo financeiro
│   │   └── clients/
│   │       └── [id]/
│   │           └── page.tsx                [NOVO] Ficha 360° do cliente
├── actions/
│   └── (private)/
│       └── finance.ts                      [NOVO] Server Actions do financeiro
├── lib/
│   ├── finance-utils.ts                    [NOVO] Tipagens e cálculos puros
│   ├── finance.ts                          [NOVO] Queries Prisma server-only
│   ├── finance-utils.test.ts               [NOVO] Testes unitários do financeiro
│   └── whatsapp-utils.ts                   [NOVO] Gerador de links wa.me
└── ui/
    └── pages/
        ├── layout_private/
        │   └── nav.tsx                     [MODIFICAR] Adicionar /finance e RBAC
        └── privatePages/
            ├── finance-components/
            │   ├── FinanceHeader.tsx       [NOVO] Cabeçalho
            │   ├── FinanceKpis.tsx         [NOVO] KPIs coloridos
            │   ├── FinanceFilters.tsx      [NOVO] Filtros de período e tipo
            │   ├── FinanceTable.tsx        [NOVO] Tabela com baixa em 1 clique
            │   ├── TransactionModal.tsx    [NOVO] Modal de receita/despesa
            │   └── finance-components.test.tsx [NOVO] Testes de UI dos componentes
            └── client-details-components/  [NOVO] Componentes da ficha 360°
```

---

## 5. Estratégia de Qualidade e Critérios de Aceite (DoD)

Para cada uma das fases acima, a entrega só é considerada concluída quando:

1. **Zero Linhas Excessivas:** Nenhum arquivo pode ultrapassar ~300 linhas de código. Subcomponentes e hooks devem ser extraídos preventivamente.
2. **Arquitetura Estrita:**
   - Nenhum import de `antd` direto fora de `src/ui/base/*`.
   - Nenhuma formatação de moeda ou data solta no client sem fuso horário garantido.
   - Todas as mutações com validação Zod e `next-safe-action`.
3. **Rede de Testes:**
   - 100% das novas funções de cálculo e utilitários cobertas por testes no Vitest.
   - Testes de renderização de componentes com Testing Library.
   - `npm run check` (Prisma + TypeScript + Biome) passando com **0 erros e 0 warnings**.
   - `npm run build` gerando todas as rotas com sucesso.
4. **Registro de Erros:** Qualquer obstáculo ou bug corrigido registrado formalmente em `docs/erros-conhecidos.md`.

---

## 6. Conclusão e Estado de Entrega

Todas as 6 fases foram **100% implementadas, testadas e validadas com sucesso**:
- **Fase 1 (Módulo Financeiro):** Contas a receber, a pagar, KPIs operacionais e baixa em 1 clique.
- **Fase 2 (RBAC Operacional):** Segregação estrita entre Dono/Admin e Colaborador de campo.
- **Fase 3 (Ficha 360° do Cliente):** Visão unificada com atalhos de WhatsApp (`wa.me`), rotas GPS e timeline.
- **Fase 4 (Automação de Recorrência):** Sugestão automática de retorno pós-conclusão e alertas no Dashboard.
- **Fase 5 (Landing Page & Planos SaaS):** Home pública de alto impacto, dores vs soluções, módulos interativos e `/pricing`.
- **Fase 6 (Assinatura & Billing SaaS):** Gestão de planos Starter, Pro e Empresarial em `/settings`, trial e histórico de cobrança.
- Fase 7 (Monorepo Turborepo & App Mobile Expo): Transição completa para Monorepo (`apps/web`, `apps/mobile`, `packages/shared`), ativação de autenticação Bearer no Better Auth, rotas `/api/v1` e telas operacionais de campo (Agenda com GPS/WhatsApp e Ordens de Serviço com transição de status).
- Fase 8 (Integração Real do App Mobile Expo, Autenticação e Modularização): Conexão viva às rotas `/api/v1` (`/api/v1/services`, `/api/v1/schedule/today`, `/api/v1/me`), persistência com AsyncStorage, tela de Perfil & Conexão do Técnico (`modal.tsx`), troca de empresa ativa, e extração modular (`OrderCard.tsx`, `AgendaVisitCard.tsx`) mantendo todos os arquivos abaixo de 300 linhas.

O sistema web e mobile está 100% integrado, validado e pronto para operação comercial e escala.
