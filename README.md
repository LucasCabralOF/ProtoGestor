# Proto

Aplicacao administrativa em `Next.js` com autenticacao, multi-tenant por organizacao e modulos iniciais de dashboard e clientes.

## Stack

- `Next.js` 16 + App Router
- `React` 19 + `TypeScript`
- `Ant Design`
- `Prisma` + PostgreSQL
- `better-auth`
- `next-intl`
- `next-safe-action`
- `Vitest`

## Requisitos

- Node.js 20+
- PostgreSQL

## Variaveis de ambiente

Crie um arquivo `.env` com:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
BETTER_AUTH_SECRET="uma-chave-segura"
BETTER_AUTH_URL="http://localhost:3001"
```

## Como rodar

```bash
npm install
npm run db:generate
npm run db:migrate:dev
npm run dev
```

A aplicacao sobe em `http://localhost:3001`.

## Banco e seed

Para recriar a base local e popular dados demo:

```bash
npm run db:reset
```

O seed cria um usuario demo e uma organizacao de exemplo para popular dashboard e clientes.

## Scripts uteis

```bash
npm run dev
npm run build
npm run start
npm run check
npm run check:ci
npm run test:unit
npm run db:generate
npm run db:migrate:dev
npm run db:studio
```

## Estrutura principal

- `src/app`: rotas publicas, privadas e handlers
- `src/lib`: auth, prisma e consultas de dominio
- `src/actions`: server actions com validacao
- `src/prisma`: schema, migrations e seed
- `src/ui`: componentes base e paginas
- `src/locales`: traducao `pt-BR` e `en`

## Observacoes

- As rotas privadas exigem sessao valida.
- O tenant atual e resolvido a partir da membership do usuario.
- O comando `npm run check` gera o Prisma Client antes da validacao para evitar inconsistencias em ambiente limpo.
