# AGENTS.md

## Contexto
Protótipo SaaS multi-tenant em Next.js 16.1.x com App Router, TypeScript, Tailwind v4, Ant Design v6.3, Better Auth, Prisma v7 e `next-safe-action`.

O app roda na raiz do repositório, sem subpasta `/web`.

Ambiente atual:
- App em `http://localhost:3001`
- Postgres local via DevContainer em `localhost:5433`
- Workspace principal em `/home/app`
- Alias de import: `@/* -> src/*`

## Stack Atual
- Next.js `^16.1.6`
- React `19.2.0`
- TypeScript `strict`
- Tailwind CSS v4 via `@import "tailwindcss"`
- Ant Design `6.3.0`
- `@ant-design/nextjs-registry`
- `next-intl` `4.8.0`
- Better Auth `^1.4.18`
- Prisma `7.3.0` + `@prisma/adapter-pg`
- `pg`
- Zustand `5`
- Zod `4`
- `next-safe-action` `8`
- Biome `2`
- Vitest `4`

## Estrutura do Projeto
- `src/app/*`: rotas App Router
- `src/app/(private)/*`: áreas autenticadas
- `src/app/(public)/*`: login e signup
- `src/app/api/*`: auth e locale
- `src/actions/*`: server actions com `next-safe-action`
- `src/lib/*`: auth, prisma e queries server-side
- `src/ui/base/*`: wrappers tipados do AntD
- `src/ui/providers/*`: providers globais
- `src/ui/pages/*`: páginas e shells client-side
- `src/stores/*`: Zustand
- `src/utils/*`: constantes e i18n
- `src/prisma/*`: schema, migrations e seed
- `src/prisma/models/*`: schema Prisma modularizado por domínio

## Arquitetura Atual
- `src/app/layout.tsx` resolve locale/messages no server, lê cookies e injeta `Providers`.
- `src/ui/providers/Providers.tsx` compõe `NextIntlClientProvider`, `AntdRegistry` e `ClientProviders`.
- `src/ui/providers/ClientProviders.tsx` hidrata Zustand 1x, sincroniza cookies e aplica/remove `.dark` no `<html>`.
- `src/app/(private)/layout.tsx` protege rotas privadas via Better Auth e entrega o `user` ao `PrivateShell`.
- Multi-tenant é resolvido no server por `requireOrgId()` em `src/lib/auth-tenant.ts`.
- Prisma usa `pg.Pool` + `PrismaPg` e mantém singleton em desenvolvimento.

## Rotas Reais do Projeto
- `/` redireciona para `/dashboard` se houver sessão; senão `/login`
- `/login`
- `/signup`
- `/dashboard`
- `/clients`
- `/clients/export`
- `/clients/import`
- `/api/auth/[...all]`
- `/api/locale`

## Internacionalização
- Não usar middleware.
- Não usar rota dinâmica `[locale]`.
- Locale vem de cookie `NEXT_LOCALE`.
- Configuração central em `src/utils/i18n.ts`.
- Locales atuais: `pt-BR` e `en`.
- Hoje o `getRequestConfig` carrega `common.json`; arquivos adicionais como `auth.json` existem, mas precisam ser conectados explicitamente se forem usados.

## Tema e UI
- Tema global baseado em CSS variables em `src/app/globals.css`.
- `THEMES_ANTD` e `LOCALES_ANTD` ficam em `src/utils/constants.ts`.
- `ClientProviders` é a fonte de verdade para tema/locale no client.
- Use wrappers em `src/ui/base/*` para Button, Card, Input, Form e afins.
- Ícones preferenciais: `react-icons`.
- Tailwind deve consumir tokens CSS já existentes antes de introduzir novas cores.

## Auth e Tenant
- Auth via Better Auth com email/senha.
- Session é lida no server.
- `orgId` nunca deve vir do client.
- Sempre resolver tenant a partir de `Membership` do usuário autenticado.
- Helpers canônicos:
  - `requireUserId()`
  - `requireOrgId()`

## Prisma e Dados
- Schema Prisma está em `src/prisma/schema.prisma` com modelos fragmentados em `src/prisma/models/*`.
- Seed em `src/prisma/seed.ts` cria:
  - usuário demo
  - organização demo
  - membership owner
  - clientes, tags, financeiro, service order, appointments e activity log de exemplo
- O projeto já possui migrations versionadas em `src/prisma/migrations/*`.

## Convenções Operacionais
1. AntD v6:
- Proibido importar `antd` fora de `src/ui/base/*` e `src/ui/providers/*`.
- Sempre preferir wrappers.

2. Barrel exports:
- Não criar `index.ts` agregador de exports.

3. React:
- Não usar `import React from "react"`.

4. Server/client boundary:
- `prisma`, `auth`, `headers`, `cookies` e queries sensíveis ficam no server.
- Client component não deve acessar APIs server-only.

5. Datas:
- Formatar datas do banco no server.
- Evitar `toLocaleString()` no client para dados vindos do banco.
- O projeto já usa formatação server-side em partes como `src/lib/clients.ts`.

6. Query string:
- Para filtros e busca, usar `usePathname()`, `useSearchParams()` e `router.replace()`.
- Não hardcode a rota atual quando o componente puder ser reutilizado.

7. Actions:
- Mutations devem usar `next-safe-action`.
- Validar input com Zod.
- Após mutation, usar `router.refresh()` no client e `revalidatePath()` quando fizer sentido no server.

8. Acessibilidade:
- Com wrappers do AntD, preferir `aria-labelledby` com ids estáveis.
- Evitar depender de `<label>` envolvendo componentes wrapper quando isso conflitar com lint/a11y.

9. Estilo:
- `Card` do AntD v6 deve usar `styles={{ body: ... }}` em vez de `bodyStyle`.
- Evitar hardcode de cores sem necessidade.

10. DevContainer:
- Não persistir `.next` como volume.
- App exposto na porta `3001`.
- Banco exposto na porta `5433`.

## Regras Importantes para Next 16
- `headers()` e `cookies()` são assíncronos.
- Quando a API exigir objeto simples, converter `Headers` para `Record<string, string>`.
- O helper de referência está em `src/lib/auth-tenant.ts`.

## Domínios Já Mapeados
- Auth / RBAC
- Organization / Membership
- Contacts
- Tags
- Addresses
- Services / Schedule
- Finance
- Audit / ActivityLog

## Estado Atual
- Dashboard funcional com KPIs, atividade recente e próximos serviços.
- Módulo de clientes funcional com:
  - listagem
  - filtros por querystring
  - criação
  - edição
  - ativação/inativação
  - export CSV
  - import CSV
- Store global já cobre `theme`, `locale` e `user`.
- `README.md` ainda está no template padrão do Next e não descreve o projeto real.

## Scripts Úteis
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run check`
- `npm run check:ci`
- `npm run check:fix`
- `npm run check:locales`
- `npm run db:generate`
- `npm run db:migrate:dev`
- `npm run db:migrate:deploy`
- `npm run db:push`
- `npm run db:reset`
- `npm run db:studio`
- `npm run test:unit`

## Checklist Antes de Alterar Código
- Importei AntD direto fora de wrappers/providers? Não.
- Criei barrel export? Não.
- Coloquei lógica server-only em client component? Não.
- Recebi `orgId` do client? Não.
- Formatei data de banco no client? Não.
- Hardcodei pathname onde deveria usar o caminho atual? Não.
- Usei mutation fora de `next-safe-action` sem motivo forte? Não.
- Usei `bodyStyle` em `Card`? Não.

## Observações para Próximas Tarefas
- Preserve a separação entre dados server-side e rendering client-side.
- Reaproveite componentes de `src/ui/pages` e wrappers de `src/ui/base` antes de criar novos.
- Ao tocar em auth/sessão no Next 16, prefira seguir o padrão de `src/lib/auth-tenant.ts`.
- Se adicionar novas telas privadas, mantenha o guard no grupo `(private)` e a resolução de tenant no server.
