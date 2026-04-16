# Proto

Prototipo SaaS multi-tenant em `Next.js` para gestao operacional de empresas de servicos recorrentes e atendimento em campo.

## Posicionamento do produto

O projeto esta sendo direcionado para um SaaS vertical de operacao, com foco em:

- clientes
- agenda e recorrencia
- ordens de servico
- financeiro basico
- relatorios operacionais

O objetivo nao e construir um ERP generico nem prender o produto a um unico nicho por causa da seed.

O one-pager do produto esta em [docs/product-one-pager.md](/home/app/docs/product-one-pager.md:1).

Documentacao de produto:

- [One-pager](/home/app/docs/product-one-pager.md:1)
- [Copy de landing page](/home/app/docs/landing-page-copy.md:1)
- [Backlog priorizado do MVP](/home/app/docs/mvp-backlog.md:1)
- [Proposta inicial de planos e preco](/home/app/docs/pricing-strategy.md:1)

## Stack

- `Next.js` 16 + App Router
- `React` 19 + `TypeScript`
- `Ant Design`
- `Prisma` + PostgreSQL
- `better-auth`
- `next-intl`
- `next-safe-action`
- `Vitest`
- `Playwright`

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

Tambem existe um modelo em [`.env.example`](/home/app/.env.example:1).

## Como rodar

```bash
npm install
npm run db:generate
npm run db:migrate:dev
npm run dev
```

A aplicacao sobe em `http://localhost:3001`.

## Acesso externo com Docker

Quando a aplicacao roda no DevContainer, o IP `172.x.x.x` do container e interno do Docker e nao deve ser usado por outras pessoas.

O projeto ja publica a porta do container para a maquina host em [`.devcontainer/compose.yaml`](/home/app/.devcontainer/compose.yaml:10):

```yaml
ports:
  - "3001:3001"
```

Com isso, o acesso deve ser feito pela maquina host:

- Na propria maquina: `http://localhost:3001`
- Na mesma rede local: `http://IP_DA_SUA_MAQUINA:3001`
- Pela internet: expose a porta `3001` no roteador/firewall ou use um tunel como `cloudflared` ou `ngrok`

Para funcionar de fora do container, o Next precisa escutar em `0.0.0.0`. O script `npm run dev` deste projeto ja faz isso.

Exemplo de tunel com Cloudflare:

```bash
cloudflared tunnel --url http://localhost:3001
```

Exemplo de tunel com ngrok:

```bash
ngrok http 3001
```

## Banco e seed

Para recriar a base local e popular dados demo:

```bash
npm run db:reset
```

O seed cria um usuario demo e uma organizacao de exemplo para popular o ambiente com dados operacionais.

Os exemplos usados na seed sao ilustrativos e nao definem o nicho final do produto.

## Scripts uteis

```bash
npm run dev
npm run build
npm run start
npm run check
npm run check:ci
npm run test:unit
npm run test:e2e
npm run test:e2e:headed
npm run test:all
npm run db:generate
npm run db:migrate:dev
npm run db:studio
```

## Testes E2E com Playwright

O projeto agora possui uma base de smoke/E2E em `playwright/tests` com autenticacao reaproveitando o usuario demo da seed.

```bash
npm run test:e2e
```

Esse comando:

- reseta e popula o banco com a seed
- garante a instalacao do Chromium do Playwright
- sobe o app automaticamente
- executa a suite E2E

Para depuracao visual:

```bash
npm run test:e2e:headed
```

Fluxos cobertos inicialmente:

- redirects publicos e protecao de rotas privadas
- login autenticado com o usuario demo
- smoke do dashboard com dados seed
- filtros e criacao de cliente no modulo de clientes

Credenciais demo usadas nos testes:

```bash
demo@local.dev
Demo@1234
```

## Estrutura principal

- `src/app`: rotas publicas, privadas e handlers
- `src/lib`: auth, prisma e consultas de dominio
- `src/actions`: server actions com validacao
- `src/prisma`: schema, migrations e seed
- `src/ui`: componentes base e paginas
- `src/locales`: traducao `pt-BR` e `en`

## Escopo atual do app

- `dashboard`: visao inicial da operacao
- `clients`: cadastro, filtros, importacao e exportacao
- `services`: base de ordens de servico e agendamento
- `reports`: indicadores e exportacao de relatorios
- `projects`: modulo exploratorio e ainda nao tratado como core do produto
- `settings`: preferencias de conta, idioma e tema

## Observacoes

- As rotas privadas exigem sessao valida.
- O tenant atual e resolvido a partir da membership do usuario.
- O comando `npm run check` gera o Prisma Client antes da validacao para evitar inconsistencias em ambiente limpo.

## Deploy na Vercel

Configuracao recomendada ao importar o repositorio:

- `Application Preset`: `Next.js`
- `Root Directory`: `./`
- `Build and Output Settings`: usar o padrao da Vercel

Variaveis de ambiente obrigatorias na Vercel:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
BETTER_AUTH_SECRET="uma-chave-bem-grande-e-segura"
BETTER_AUTH_URL="https://SEU-PROJETO.vercel.app"
```

Notas importantes:

- O `DATABASE_URL` precisa apontar para um Postgres acessivel pela internet. O banco local do Docker nao funciona na Vercel.
- O `BETTER_AUTH_URL` em producao deve usar a URL publica do deploy em `https`.
- O `BETTER_AUTH_SECRET` deve ser estavel entre deploys.

Depois de configurar a primeira publicacao, aplique as migrations no banco de producao:

```bash
npm run db:migrate:deploy
```

Se quiser popular um ambiente de homologacao com os dados demo, rode o seed manualmente:

```bash
npx prisma db seed
```
