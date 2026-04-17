# AGENTS.md

## Filosofia de Desenvolvimento

Este projeto usa **engenharia de software acelerada por IA**, não "vibe coding".
O agente de IA é o par de pair programming — digita rápido, não cansa, lê toda a documentacão antes de cada sessão.
O humano é o dono do produto e o revisor: decide **o quê**, o agente decide **o como**.

Princípios que guiam toda decisão técnica (baseados em XP — Extreme Programming):

1. **TDD é mais importante com IA, não menos.** O agente modifica código com confiança porque existe uma rede de testes. Sem testes, cada mudança é uma aposta. Testes retroativos não contam — são cirurgia de emergência, não engenharia.

2. **Small releases. Cada commit é production-ready.** Nenhum commit de "juntar tudo". Se uma feature é má ideia, nunca dependeu de outra. Commits cirúrgicos permitem reverter sem dor.

3. **Refactoring contínuo, não cirurgias de emergência.** Extrair um concern leva 2 minutos com testes existentes. Não fazer isso e acumular dívida leva horas de cirurgia arriscada depois. Refatorar constantemente em pequenos passos.

4. **O agente nunca diz não — isso é um bug, não uma feature.** Se o humano pede algo over-engineered, inseguro ou que viola regras deste documento, o agente implementa com entusiasmo. O humano é o freio, o code review, o adulto na sala.

5. **Documentação é investimento com retorno imediato.** Este AGENTS.md é o "onboarding doc" que o agente lê inteiro antes de cada sessão. Cada hurdle descoberto deve ser documentado aqui ou em `docs/erros-conhecidos.md`. Na próxima sessão, o agente já sabe.

6. **Nunca acumule dívida técnica visível.** Arquivo crescendo além de ~300 linhas? Extrair. Lógica duplicada? DRY imediatamente. CSS monolítico? Componentizar. O padrão "construir-construir-PARAR-refatorar em bloco" é falha de processo.

> **Referência:** O mesmo desenvolvedor, com o mesmo agente de IA, produziu 3x mais throughput (34 commits/dia vs 11) simplesmente aplicando XP. A variável não foi a IA — foi o processo.

---

## Contexto Atual
Protótipo SaaS multi-tenant em Next.js, rodando na raiz do repositório (sem `/web`), com App Router e DevContainer baseado em Docker Compose.

Ambiente local atual:
- App: porta `3001`
- Postgres 16: container local, exposto em `5433`
- Prisma Studio: script usa porta `5556`
- Workspace do DevContainer: `/home/app`

## Direcao de Produto
- O produto deve ser tratado como um SaaS de gestao operacional para pequenas empresas de servicos recorrentes e atendimento em campo.
- O posicionamento principal e `clientes + agenda/recorrencia + ordens de servico + financeiro basico + relatorios`.
- Nao tratar o produto como ERP generico.
- Nao tratar o produto como SaaS de limpeza por padrao so porque a seed usa esse tipo de exemplo.
- Ao escrever copy, documentacao, seeds, textos de UI e fluxos, preferir linguagem generica de operacao de servicos: `cliente`, `visita`, `tecnico`, `equipe`, `agenda`, `recorrencia`, `ordem de servico`, `cobranca`.
- O one-pager de produto de referencia fica em [`docs/product-one-pager.md`](/home/app/docs/product-one-pager.md).

## Stack Atual
- Next.js `16.1.6`
- React `19.2.0`
- TypeScript `strict`
- Tailwind CSS `4.2.x` com tokens via CSS variables em [`src/app/globals.css`](/home/app/src/app/globals.css)
- Ant Design `6.3.0`
- `next-intl` `4.8.0`
- Better Auth `1.4.18` com email/senha
- Prisma `7.7.0` + `@prisma/adapter-pg` + `pg.Pool`
- `next-safe-action` `8.0.0`
- Zustand `5.0.0`
- Biome `2.3.14`
- Vitest + Testing Library
- Playwright `1.59.x` para smoke/E2E

## Arquitetura Atual
- Providers encadeados em [`src/ui/providers/Providers.tsx`](/home/app/src/ui/providers/Providers.tsx):
  `NextIntlClientProvider` -> `AntdRegistry` -> `ClientProviders`
- [`src/ui/providers/ClientProviders.tsx`](/home/app/src/ui/providers/ClientProviders.tsx):
  hidrata Zustand 1x com `appSettings` e `user`, trata a store como fonte da verdade, aplica/remove `.dark` no `<html>` e persiste `NEXT_LOCALE` e `APP_THEME`
- Tema AntD centralizado em [`src/utils/constants.ts`](/home/app/src/utils/constants.ts), com `THEMES_ANTD` e `LOCALES_ANTD` baseados em CSS vars
- Auth server-side em [`src/lib/auth.ts`](/home/app/src/lib/auth.ts) com Better Auth + `nextCookies()`
- Contexto tenant em [`src/lib/auth-tenant.ts`](/home/app/src/lib/auth-tenant.ts):
  a organização ativa vem de membership do usuário autenticado e do cookie `ACTIVE_ORG_ID`
- Helper de contexto de páginas privadas em [`src/lib/private-context.ts`](/home/app/src/lib/private-context.ts)
- Prisma singleton em [`src/lib/prisma.ts`](/home/app/src/lib/prisma.ts), usando `PrismaPg(pool)` com `pg.Pool` reaproveitado em dev

## Rotas Atuais
- `/`: redireciona para `/dashboard` se houver sessão; senão `/login`
- Públicas:
  - `/login`
  - `/signup`
  - `/onboarding`
  - `/api/auth/[...all]`
  - `/api/locale`
- Privadas:
  - `/dashboard`
  - `/clients`
  - `/services`
  - `/reports`
  - `/projects`
  - `/settings`
- Rotas HTTP:
  - `/clients/export`
  - `/clients/import`
  - `/reports/export`

## Prisma e Domínio
Schema distribuído entre:
- [`src/prisma/schema.prisma`](/home/app/src/prisma/schema.prisma): modelos do Better Auth
- [`src/prisma/models/org.prisma`](/home/app/src/prisma/models/org.prisma)
- [`src/prisma/models/rbac.prisma`](/home/app/src/prisma/models/rbac.prisma)
- [`src/prisma/models/contacts.prisma`](/home/app/src/prisma/models/contacts.prisma)
- [`src/prisma/models/services.prisma`](/home/app/src/prisma/models/services.prisma)
- [`src/prisma/models/schedule.prisma`](/home/app/src/prisma/models/schedule.prisma)
- [`src/prisma/models/finance.prisma`](/home/app/src/prisma/models/finance.prisma)
- [`src/prisma/models/audit.prisma`](/home/app/src/prisma/models/audit.prisma)

Modelagem atual:
- Multi-tenant via `Organization` + `Membership`
- Contatos via `Contact`, `ContactRole`, `Address`, `Tag`, `ContactTagLink`
- Serviços via `ServiceOrder` + `ServiceOrderItem`
- Agenda via `Appointment` + `CalendarBlock`
- Financeiro via `Transaction`, `FinancialAccount`, `Category`
- Auditoria via `ActivityLog`

Seed atual em [`src/prisma/seed.ts`](/home/app/src/prisma/seed.ts):
- cria usuário demo
- cria duas organizações (`org_demo` e `org_branch`)
- cria memberships
- popula contatos, tags, financeiro, serviço, agendamento e atividade recente

## Status Atual do Produto
- Login, signup e guard privado funcionando
- Troca de organização ativa funcionando por cookie `ACTIVE_ORG_ID`
- Dashboard funcional com dados da seed
- Clientes funcional com:
  - busca por querystring
  - filtros de status e recorrência
  - modal de criação/edição
  - ativação/inativação
  - import/export CSV
- Services funcional com:
  - busca por querystring
  - filtros por status e cliente
  - modal de criação/edição
  - transição de status
  - agendamento básico por atendimento
- Reports funcional com:
  - filtros por foco e período
  - visão operacional e financeira agregada
  - exportação
- Projetos existe como módulo exploratório/placeholder e não deve ser tratado como core do produto neste momento
- Settings já permite trocar tema e idioma e exibe contexto da conta/organização
- Schema de agenda, serviços, financeiro e auditoria já existe; parte da UI de serviços e relatórios já consome esse domínio, mas agenda e financeiro ainda não possuem módulos dedicados completos
- Há testes unitários para utilitários de tenant e navegação
- Há base E2E com Playwright cobrindo auth, dashboard e clientes

## Observações Importantes do Estado Atual
- `next-intl` continua sem middleware e sem rota dinâmica `[locale]`; locale vem de cookie `NEXT_LOCALE`
- [`src/utils/i18n.ts`](/home/app/src/utils/i18n.ts) atualmente carrega apenas o namespace `common`
  se uma tela nova precisar de `auth` ou outro namespace, atualize essa config
- Há dois helpers de safe action hoje:
  - [`src/actions/safe.ts`](/home/app/src/actions/safe.ts)
  - [`src/actions/safeActions.ts`](/home/app/src/actions/safeActions.ts)
  não criar um terceiro padrão
- O dashboard ainda formata moeda/data no client em alguns pontos
  trate isso como débito técnico, não como padrão a ser repetido
- A seed atual usa exemplos de dados operacionais específicos apenas para demonstração
  não inferir o nicho final do produto a partir desses dados

## Regras Obrigatórias
1) AntD `6.3`
- Não importar `antd` diretamente em páginas, features ou componentes de negócio
- Imports diretos de runtime ficam restritos a:
  - `src/ui/base/*`
  - `src/ui/providers/*`
  - [`src/utils/constants.ts`](/home/app/src/utils/constants.ts) para bridge de theme/locale
- Import type-only direto deve ser exceção pontual, não regra
- Fora desses pontos, usar wrappers

2) Sem barrel exports
- Não criar `index.ts` agregando exports

3) Sem `import React from "react"`
- Use imports nomeados de tipos/hooks quando necessário

4) `next-intl`
- Sem middleware
- Sem rota `[locale]`
- Locale sempre via cookie `NEXT_LOCALE`
- Validar apenas `pt-BR` e `en`

5) Server/Client boundaries
- Prisma, auth, `headers()`, `cookies()` e helpers tenant são server-only
- `headers()` e `cookies()` são async no Next 16
- Quando alguma lib precisar de objeto simples, converter `Headers` para `Record<string, string>`
- Evitar `toLocaleString` e formatação de datas do banco no client
- Preferir strings já formatadas no server para evitar hydration mismatch

6) Multi-tenant
- `orgId` nunca vem do client
- `orgId` sempre sai de membership do usuário autenticado
- Reutilizar `requireOrgId()`, `getTenantContext()` e `getPrivatePageContext()`
- A organização ativa é decidida no server com base em memberships + cookie `ACTIVE_ORG_ID`

7) Actions e mutations
- Preferir `next-safe-action` para mutations disparadas pela UI
- Validar input com Zod
- Após mutation, disparar `router.refresh()` no client e/ou `revalidatePath()` quando fizer sentido
- Route Handlers são aceitáveis para fluxos HTTP nativos como upload/download CSV
- Reaproveitar os helpers de action já existentes; não introduzir uma terceira variação

8) UI e estilo
- Tailwind v4 + CSS vars; evitar cores hardcoded sem motivo real
- Preferir `react-icons`
- Reusar wrappers e componentes existentes antes de criar novos
- Preservar a linguagem visual atual do painel

9) DevContainer
- Não persistir `.next` em volume
- Configuração atual fica em `.devcontainer/*`
- Se houver problema de file watch em Docker/Windows/WSL, ajustar polling no `next.config.ts` só quando necessário

10) Testes (TDD — não retroativo)
- **Testes vêm antes ou junto com o código, nunca depois.** Testes retroativos são dívida técnica já acumulada.
- Toda mudança de componente deve vir com teste do comportamento entregue — não do happy path genérico
- Componentes, hooks e utilitários novos ou alterados: teste de unidade/integração com Vitest + Testing Library
- Fluxos críticos (auth, navegação privada, filtros, mutations, multi-tenant, rotas protegidas): cobertura E2E com Playwright
- Antes de concluir qualquer tarefa: rodar `npm run test:unit`; quando tocar navegação, auth ou fluxos principais: rodar também `npm run test:e2e`
- Se um teste não puder ser executado: documentar explicitamente o motivo no handoff
- **Testes são a rede de segurança que permite refactoring contínuo sem medo**

11) Documentação viva (este AGENTS.md é o spec que evolui)
- Código deve ser bem documentado com comentários que explicam **por quê**, não apenas o quê
- Sempre que um padrão novo for estabelecido ou uma decisão arquitetural for tomada, documentar aqui neste arquivo
- **Este arquivo é lido inteiro pelo agente antes de cada sessão** — investimento em documentação tem retorno imediato e exponencial
- Ao descobrir um "hurdle" (limite de biblioteca, comportamento inesperado de infraestrutura, trade-off de design), documentar na seção de Padrões Recomendados ou em `docs/erros-conhecidos.md`

12) Registro obrigatório de erros
- Todo bug corrigido deve ser documentado em [`docs/erros-conhecidos.md`](/home/app/docs/erros-conhecidos.md) antes de fechar a tarefa
- O registro deve incluir: data, arquivo, stack trace ou descrição do erro, causa raiz e técnica para evitar recorrência
- Erros de infraestrutura (banco, rede, Docker), erros de runtime (React warnings, TypeScript), bugs de layout e violações de regras do AGENTS.md são todos elegíveis para registro
- Consultar `docs/erros-conhecidos.md` ao iniciar qualquer tarefa para evitar repetir padrões já conhecidos como problemáticos

13) Refactoring contínuo (nunca cirurgia de emergência)
- Ao perceber que um arquivo ultrapassa ~300 linhas ou que uma função tem mais de uma responsabilidade clara: extrair imediatamente, em commit pequeno
- Ao ver duplicação de lógica: DRY imediatamente
- **Nunca acumular dívida técnica** com a intenção de "refatorar depois" — o "depois" com IA nunca chega antes de virar emergência
- Refactors devem ser commits isolados, separados de features: `git commit -m "refactor: extract X from Y"`
- O sinal de alerta é: "preciso refatorar para poder testar" — isso significa que o refactor deveria ter ocorrido antes

14) Small commits e releases contínuos
- Cada commit deve ser atômico: uma mudança lógica, testada e funcional
- Nunca commitar código que quebra a aplicação ou os testes
- Commits de feature misturados com refactor ou bugfix são sinal de commit grande demais — separar
- Mensagens de commit no formato: `tipo: descrição curta` (feat, fix, refactor, test, docs, chore)
- Se uma task requer mais de ~5 arquivos alterados em um commit, avaliar se pode ser quebrada

15) O agente não decide o quê — apenas o como
- O humano define prioridades, features e direção do produto
- O agente propõe implementações, aponta trade-offs, executa e testa
- Se o agente perceber que o pedido viola regras deste documento, deve **sinalizar explicitamente** antes de implementar — nunca implementar silenciosamente algo problemático
- O agente não deve over-engineer: implementar exatamente o que foi pedido, na forma mais simples que passa os testes

## Padrões Recomendados
- Filtros por querystring:
  - usar `usePathname()`, `useSearchParams()` e `router.replace()`
  - não hardcode a rota atual para filtros/pesquisa
- Páginas privadas:
  - preferir o fluxo `page.tsx` server -> lib server-side -> componente client
- A11y com wrappers:
  - preferir `aria-labelledby` com `id` estável em vez de `<label>` envolvendo wrappers
- AntD Card v6:
  - `bodyStyle` está deprecated
  - usar `styles={{ body: ... }}`
- I18n:
  - antes de usar um namespace novo, garantir que ele foi carregado em [`src/utils/i18n.ts`](/home/app/src/utils/i18n.ts)
- Testes:
  - preferir seletores estáveis (`data-testid`, `role`, `label`) para Playwright
  - novas interações visuais relevantes devem considerar cobertura unitária e, se fizer sentido, smoke E2E
- Tailwind v4 dark mode:
  - sempre declarar `@custom-variant dark (&:where(.dark, .dark *))` em `globals.css` ao usar controle de tema por classe
  - sem essa declaração, `dark:*` é ativado pelo OS via `prefers-color-scheme`, ignorando o tema da aplicação
- DevContainer / banco de dados:
  - dentro do container, usar o nome do serviço (`db`) como hostname, nunca `localhost`
  - a porta deve ser a interna do container (`5432`), não a mapeada no host (`5433`)
- React keys em listas:
  - nunca usar o **valor/conteúdo** como key quando valores podem se repetir
  - usar `id` estável do dado, ou `${identificadorDaLinha}-col-${index}` em grids de colunas fixas
- Tamanho de arquivo:
  - arquivo >300 linhas: sinal para extrair concerns
  - componente com mais de uma responsabilidade clara: extrair imediatamente em commit separado

## Checklist Antes de Enviar PR
- Consultei `docs/erros-conhecidos.md` antes de começar para não repetir padrões já conhecidos? Sim.
- Importei `antd` direto fora dos pontos permitidos? Não.
- Criei `index.ts`? Não.
- `orgId` veio do client? Não.
- Usei Prisma/Auth/headers/cookies em client component? Não.
- Copiei o padrão de formatar datas/moeda do banco no client? Não.
- Navegação de filtros foi hardcoded? Não.
- `Card` usa `bodyStyle`? Não.
- Criei mais um helper de safe action? Não.
- Adicionei namespace de tradução sem atualizar [`src/utils/i18n.ts`](/home/app/src/utils/i18n.ts)? Não.
- Criei/atualizei testes **antes ou junto** com o código (não depois)? Sim.
- Rodei `npm run test:unit` e `npm run test:e2e` quando houve impacto transversal? Sim.
- Algum arquivo ultrapassou ~300 linhas? Se sim, extraí em commit separado? Sim.
- O commit é atômico (uma mudança lógica, testada e funcional)? Sim.
- Documentei o erro corrigido em `docs/erros-conhecidos.md`? Sim.
- Sinalizei explicitamente ao humano se o pedido violava alguma regra deste documento? Sim.

## Roadmap Imediato
- Core do produto:
  - evoluir `clients + services + reports` para um fluxo comercialmente vendável de operação
- Agenda e recorrência:
  - construir UX dedicada para visitas, recorrências e acompanhamento de execução
- Financeiro básico:
  - construir UI para contas a receber, recebimentos e visão simples de caixa
- Projetos:
  - reavaliar se o módulo continua no produto ou se vira apoio derivado de serviços
- Dashboard:
  - mover formatação de datas/moeda para o server
- I18n:
  - suportar namespaces além de `common` de forma consistente
