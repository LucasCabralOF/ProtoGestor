# AGENTS.md

## Contexto Atual
Protótipo SaaS multi-tenant em Next.js, rodando na raiz do repositório (sem `/web`), com App Router e DevContainer baseado em Docker Compose.

Ambiente local atual:
- App: porta `3001`
- Postgres 16: container local, exposto em `5433`
- Prisma Studio: script usa porta `5556`
- Workspace do DevContainer: `/home/app`

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
  - `/api/auth/[...all]`
  - `/api/locale`
- Privadas:
  - `/dashboard`
  - `/clients`
  - `/projects`
  - `/settings`
- Rotas HTTP ligadas a clientes:
  - `/clients/export`
  - `/clients/import`

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
- Projetos existe como módulo placeholder com navegação pronta
- Settings já permite trocar tema e idioma e exibe contexto da conta/organização
- Schema de agenda, serviços, financeiro e auditoria já existe, mas a UI ainda não foi construída
- Há testes unitários para utilitários de tenant e navegação

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

10) Testes
- Toda mudança de componente novo deve vir com teste relativo ao comportamento entregue
- Componentes, hooks e utilitários novos ou alterados devem ter teste de unidade/integração com Vitest + Testing Library quando aplicável
- Fluxos críticos alterados ou criados (auth, navegação privada, filtros, mutations, multi-tenant, rotas protegidas) devem ganhar cobertura E2E com Playwright
- Antes de concluir uma tarefa, rodar ao menos os testes impactados; quando a mudança tocar navegação, auth, layout, páginas privadas ou fluxos principais, rodar `npm run test:unit` e `npm run test:e2e`
- Se algum teste não puder ser executado, explicitar o motivo no handoff final

11) Documentação
- codigo deve ser bem documentado

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

## Checklist Antes de Enviar PR
- Importei `antd` direto fora dos pontos permitidos? Não.
- Criei `index.ts`? Não.
- `orgId` veio do client? Não.
- Usei Prisma/Auth/headers/cookies em client component? Não.
- Copiei o padrão de formatar datas/moeda do banco no client? Não.
- Navegação de filtros foi hardcoded? Não.
- `Card` usa `bodyStyle`? Não.
- Criei mais um helper de safe action? Não.
- Adicionei namespace de tradução sem atualizar [`src/utils/i18n.ts`](/home/app/src/utils/i18n.ts)? Não.
- Criei/atualizei testes relativos aos componentes e fluxos alterados? Sim.
- Rodei `npm run test:unit` e `npm run test:e2e` quando houve impacto transversal? Sim.

## Roadmap Imediato
- Clientes:
  - evoluir tags, UX do menu de ações, validações e import/export
- Projetos:
  - sair do placeholder e virar módulo real com escopo, etapas, responsáveis e progresso
- Agenda/Serviços/Financeiro:
  - construir UI em cima do schema já existente, mantendo as regras de tenant e server/client boundary
- Dashboard:
  - mover formatação de datas/moeda para o server
- I18n:
  - suportar namespaces além de `common` de forma consistente
