# Erros Conhecidos — Registro e Técnicas de Prevenção

> Este documento registra erros reais encontrados durante o desenvolvimento, com contexto, causa raiz e como evitar que se repitam.
> **Toda vez que um bug for corrigido, ele deve ser documentado aqui antes de fechar a tarefa.**

---

## ERR-001 — Banco de dados inacessível dentro do DevContainer

**Data:** 2026-04-17  
**Arquivo:** `.env`  
**Erro:**
```
PrismaClientKnownRequestError: Can't reach database server at 127.0.0.1:5433
```

**Causa raiz:**  
Dentro do container `app`, `localhost` aponta para o próprio container e não para o serviço de banco de dados. A porta `5433` só existe no host externo (mapeamento Docker). A comunicação interna deve usar o hostname da rede docker-compose.

**Correção aplicada:**
```env
# Errado (funciona apenas no host, não dentro do container)
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/app?schema=public"

# Correto (hostname interno da rede docker-compose)
DATABASE_URL="postgresql://postgres:postgres@db:5432/app?schema=public"
```

**Regra para evitar recorrência:**
- Dentro do DevContainer, sempre usar o **nome do serviço** definido em `compose.yaml` como hostname (ex: `db`).
- A porta deve ser a **interna do container** (ex: `5432`), não a mapeada no host (ex: `5433`).
- Nunca usar `localhost` ou `127.0.0.1` para serviços irmãos do compose.

---

## ERR-002 — Dark mode Tailwind v4 aplicado via media query, ignorando classe `.dark`

**Data:** 2026-04-17  
**Arquivo:** `src/app/globals.css`  
**Erro (comportamento):**  
Utilitários `dark:*` do Tailwind eram ativados pelo sistema operacional do usuário (via `prefers-color-scheme`), e não pela classe `.dark` gerenciada pela aplicação (Zustand + ClientProviders). Isso gerava inconsistência visual: fundo escuro sem texto claro ou vice-versa.

**Causa raiz:**  
No Tailwind CSS v4, o comportamento padrão do modo escuro mudou de `class` para `media`. O boilerplate não configurava explicitamente a variante `dark` para operar via classe.

**Correção aplicada:**
```css
/* Adicionar logo após @import "tailwindcss" em globals.css */
@custom-variant dark (&:where(.dark, .dark *));
```

**Regra para evitar recorrência:**
- Em projetos Tailwind v4, **sempre declarar `@custom-variant dark`** explicitamente no `globals.css` quando o tema é controlado por classe.
- O seletor `&:where(.dark, .dark *)` permite que tanto o elemento que recebe `.dark` quanto seus descendentes sejam cobertos.
- Verificar essa configuração ao iniciar qualquer novo projeto com Tailwind v4.

---

## ERR-003 — Chave React duplicada em tabela de comparação de planos

**Data:** 2026-04-17  
**Arquivo:** `src/ui/pages/publicPages/MarketingPricingPage.tsx` (linha 247)  
**Erro:**
```
Warning: Encountered two children with the same key, `Motor inteligente de Agenda-Tudo liberado`.
Keys should be unique so that components maintain their identity across updates.
```

**Causa raiz:**  
A key da célula da tabela era composta pelo `label da linha + valor da célula`: `` `${row.label}-${value}` ``. Quando duas colunas distintas da mesma linha têm o mesmo conteúdo textual (ex: "Tudo liberado" em `founders` e em `team`), a key fica idêntica dentro do mesmo `map`.

**Correção aplicada:**
```tsx
// Errado — valor da célula não garante unicidade
key={`${row.label}-${value}`}

// Correto — posição da coluna garante unicidade dentro da linha
key={`${row.label}-col-${index}`}
```

**Regra para evitar recorrência:**
- **Nunca usar o conteúdo/valor como key** quando os valores podem se repetir entre itens do mesmo `map`.
- Em grids ou tabelas com colunas fixas, usar sempre `index` ou um identificador estrutural (ex: nome da coluna).
- A key segura deve ser única **dentro do array** em que está sendo mapeada, não globalmente.
- Estratégias confiáveis de key, em ordem de preferência:
  1. `id` estável vindo do dado (ex: `plan.id`)
  2. Identificador composto estável (ex: `${row.label}-col-${colName}`)
  3. `index` quando a lista é **imutável e nunca reordenada**

---

## ERR-004 — Layout quebrado por grids aninhados excessivamente

**Data:** 2026-04-17  
**Arquivo:** `src/ui/pages/publicPages/MarketingHomePage.tsx`  
**Erro (comportamento):**  
Textos em blocos estreitos, quebrando palavra por palavra em colunas verticais ilegíveis ("Agenda\n inteli-\ngente").

**Causa raiz:**  
Uma área já dividida em `grid-cols-[50%_50%]` recebia outro `grid-cols-5` interno, resultando em colunas de ~10% da tela — espaço insuficiente para qualquer texto correr horizontalmente.

**Correção aplicada:**  
Substituído `xl:grid-cols-5` por `sm:grid-cols-2` no bloco de features, e convertido sub-grids aninhados em `flex-col` onde o empilhamento era mais adequado.

**Regra para evitar recorrência:**
- Antes de definir colunas em um grid filho, calcular a **largura efetiva disponível**: `largura total × fração do pai × fração do avô...`
- Usar `text-balance` e `text-pretty` em títulos e parágrafos de marketing para deixar o navegador gerenciar quebras de linha de forma inteligente.
- Evitar `grid-cols-N` com N > 3 em containers que já ocupem menos de 50% da viewport.
- Preferir `flex-col` quando os filhos devem empilhar-se verticalmente com espaço total; reservar grid para when alignment bidimensional é necessária.

---

## ERR-005 — Testes unitários ausentes após alteração de componentes

**Data:** 2026-04-17  
**Arquivos:** `MarketingHomePage.tsx`, `MarketingPricingPage.tsx`  
**Erro:** AGENTS.md regra 10 violada — componentes foram alterados sem criação ou execução de testes.

**Causa raiz:**  
Omissão no processo de desenvolvimento: correções de layout e bug foram entregues sem verificar cobertura de teste existente nem criar testes novos.

**Regra para evitar recorrência:**
- **Sempre** verificar se existe teste para o componente antes de alterar e rodar ao menos `npm run test:unit` após mudanças.
- Ao criar ou modificar qualquer componente de página pública, criar ao mínimo um teste de smoke (renderização sem crash) com Vitest + Testing Library.
- O checklist de PR no AGENTS.md deve ser executado mentalmente antes de qualquer commit, incluindo o item de testes.

---

## ERR-006 — Redirect prematuro no onboarding após criação de org via Server Action

**Data:** 2026-04-17  
**Arquivo:** `src/ui/pages/onboarding/OnboardingPage.tsx` + `src/app/onboarding/page.tsx`  
**Erro (comportamento):**  
Usuário preenche Step 1 (nome da empresa), clica em "Próximo" e é redirecionado para `/dashboard` sem ver o Step 2.

**Causa raiz:**  
`createOrganizationAction` era chamada no Step 1. Como é uma Server Action, ao completar:
1. Seta o cookie `ACTIVE_ORG_COOKIE`
2. O Next.js App Router invalida o Router Cache para a rota `/onboarding`
3. O servidor re-renderiza `OnboardingRoute`
4. `getTenantContext()` agora encontra a org (cookie presente)
5. `redirect("/dashboard")` é disparado antes do usuário ver Steps 2 e 3

**Correção aplicada:**  
Movida a chamada de `createOrganizationAction` para o **Step 3** (`Step3Confirm`), onde o usuário já completou todos os passos do wizard. Logo após a criação, chamamos `router.replace("/dashboard")` imediatamente — a navegação chega antes de qualquer re-render problemático.

Além disso, o campo `segment` (select nativo dentro de `Form.Item` AntD) foi extraído para **estado local** (fora do Form), eliminando o warning `defaultValue will not work on controlled Field`.

**Regra para evitar recorrência:**  
- **Nunca chamar Server Actions que escrevem cookies** no meio de um wizard multi-steps client-side — o Router Cache será invalidado e o servidor pode redirecionar o usuário de forma inesperada.
- A criação de recursos que afetam o estado de autenticação/tenant deve acontecer no **último passo intencional** do wizard.
- Campos nativos (`<select>`, `<input type="radio">`) dentro de `Form.Item` AntD devem ser controlados via estado local + `form.setFieldValue`, ou gerenciados completamente fora do Form para evitar conflito de `defaultValue`.

---

## ERR-007 — Deslocamento de horário de agendamentos por uso de UTC (.toISOString()) no client

**Data:** 2026-09-06  
**Arquivo:** `src/ui/pages/privatePages/SchedulePage.tsx`  
**Erro (comportamento):**  
Ao abrir o modal de edição de uma visita agendada para 09:00 (fuso de Brasília, UTC-3), o formulário carregava o horário como 12:00. Ao salvar sem alterar o horário, a action aplicava o offset `-03:00` novamente, deslocando o compromisso para 15:00 UTC (+3h a cada salvamento). Além disso, `toISOString().slice(0, 10)` podia retornar o dia seguinte para visitas tarde da noite.

**Causa raiz:**  
O método `Date.prototype.toISOString()` sempre retorna a data e hora em tempo universal (UTC/Z), ignorando o fuso horário local ou comercial da aplicação (`America/Sao_Paulo`).

**Correção aplicada:**
1. Criadas as funções `formatDateInput(date)` e `formatTimeInput(date)` no servidor (`schedule-utils.ts`), usando `Intl.DateTimeFormat` com `timeZone: "America/Sao_Paulo"`.
2. Adicionados os campos pré-formatados `dateInput`, `startTimeInput` e `endTimeInput` em `AppointmentRow`.
3. Em `SchedulePage.tsx`, `openEdit` consome diretamente esses campos do server, e interações de drag-and-drop / seleção usam `format` da biblioteca `date-fns`.

**Regra para evitar recorrência:**
- **Nunca utilizar `.toISOString()`** para extrair partes de data ou hora para exibição ou inputs em formulários voltados ao usuário.
- Formatações de data e hora do banco devem ser realizadas no servidor com o timezone explícito da organização (`America/Sao_Paulo`).

---

## ERR-008 — Falhas generalizadas de formatação no Biome causadas por EOL CRLF no host Windows

**Data:** 2026-09-06  
**Arquivo:** `.gitattributes`, `biome.json`  
**Erro:**  
O comando `npm run check` falhava com centenas de erros de formatação (`biome check`), acusando a presença de caracteres de retorno de carro `\r` (`␍`) em todos os arquivos do repositório.

**Causa raiz:**  
No Windows, o Git por padrão opera com `core.autocrlf = true`, convertendo quebras de linha LF para CRLF (`\r\n`) no checkout do disco. O Biome adota LF (`\n`) como padrão estrito de formatação, marcando qualquer arquivo CRLF como fora de conformidade.

**Correção aplicada:**
1. Adicionado arquivo `.gitattributes` na raiz com `* text=auto eol=lf`, forçando o Git a manter `LF` em todos os sistemas operacionais.
2. Adicionada a pasta `scratch` na lista de exclusão do `biome.json` (`"!scratch"`).

**Regra para evitar recorrência:**
- Repositórios com Biome ou Prettier rodando no Windows devem conter um arquivo `.gitattributes` definindo explicitamente `* text=auto eol=lf`.

---

## ERR-009 — Conflito de resolução do pacote 'server-only' em testes unitários Vitest

**Data:** 2026-09-06  
**Arquivo:** `src/lib/members.ts`, `src/actions/safeActions.ts`, testes Vitest  
**Erro:**  
```
Cannot find package 'server-only' imported from 'src/lib/members.ts'
Failed to resolve import "server-only" from "src/actions/safeActions.ts"
```

**Causa raiz:**  
O pacote `server-only` do React Server Components é resolvido exclusivamente pelo bundler do Next.js no ambiente de compilação do servidor. Quando arquivos contendo `import "server-only"` são importados direta ou indiretamente em testes unitários sob o Vitest (especialmente no ambiente jsdom), o resolver falha.

**Correção aplicada:**
1. Funções puras de formatação e tipagem foram isoladas em arquivos utilitários sem `server-only` (ex: `src/lib/members-utils.ts` e `src/lib/schedule-utils.ts`).
2. Testes de componentes de UI que renderizam botões disparando server actions devem mockar as actions via `vi.mock("@/actions/...")`, impedindo que o runtime de teste tente importar `safeActions.ts` e suas dependências de servidor.

**Regra para evitar recorrência:**
- Separar utilitários puros de lógica de banco de dados (`*-utils.ts` vs `*.ts`).
- Sempre mockar Server Actions (`vi.mock`) em testes unitários de componentes React client-side.

---

## ERR-010 — Incompatibilidade da API do hook useAppFeedback (propriedade 'message' inexistente)

**Data:** 2026-09-06  
**Arquivo:** `src/ui/base/useAppFeedback.ts`, componentes client  
**Erro:**  
```
Property 'message' does not exist on type '{ confirm: ...; notifyError: ...; notifySuccess: ...; }'
```

**Causa raiz:**  
O hook customizado `useAppFeedback` encapsula as notificações do AntD através dos métodos nomeados `notifySuccess`, `notifyError` e `confirm`, e não expõe a instância crua `message` do AntD.

**Correção aplicada:**  
Substituir chamadas a `message.success(...)` e `message.error(...)` pelos helpers tipados `notifySuccess(...)` e `notifyError(...)`.

**Regra para evitar recorrência:**  
- Ao usar `useAppFeedback()`, sempre desestruturar `{ notifySuccess, notifyError, confirm }`.

---

## ERR-011 — Poluição residual do DOM entre testes sequenciais de componentes sob Vitest

**Data:** 2026-09-06  
**Arquivo:** Arquivos `*.test.tsx` com `@testing-library/react`  
**Erro:**  
```
AssertionError: expected <button ...> to be null
- Expected: null
+ Received: <button ...>
```

**Causa raiz:**  
Quando o Vitest roda sem a flag `globals: true` ou sem um arquivo de setup global configurando o ciclo de vida do Testing Library, as renderizações feitas por `render(<Component />)` dentro de blocos `it(...)` sucessivos permanecem anexadas ao `document.body`, causando falsos positivos em asserções do tipo `queryBy...().toBeNull()`.

**Correção aplicada:**  
Importar `cleanup` de `@testing-library/react` e registrar a limpeza explícita após cada teste:
```tsx
afterEach(() => {
  cleanup();
});
```

**Regra para evitar recorrência:**  
- Em todo arquivo de teste unitário React (`*.test.tsx`) que realize múltiplos `render(...)`, registrar explicitamente `afterEach(() => cleanup())`.

---

## ERR-012 — Padrões de ignore do Biome em estruturas Monorepo com workspaces

**Data:** 2026-09-08  
**Arquivo:** `biome.json`  
**Erro:**  
```
The number of diagnostics exceeds the limit allowed. Use --max-diagnostics to increase it.
Found 51708 errors (.next\dev\server\...)
```

**Causa raiz:**  
Ao migrar para estrutura de monorepo (`apps/web`, `apps/mobile`), o arquivo `biome.json` na raiz usava padrões simples como `!.next` e `!node_modules`. Esses padrões não ignoram subdiretórios em pacotes aninhados (como `apps/web/.next` ou `apps/mobile/.expo`), fazendo com que o Biome analisasse arquivos compilados e gerados internamente.

**Correção aplicada:**  
Utilizar padrões glob universais com `**/` para ignorar os diretórios em qualquer nível da árvore:
```json
"includes": [
  "**",
  "!**/node_modules/**",
  "!**/.next/**",
  "!**/.expo/**",
  "!**/.turbo/**",
  "!**/dist/**",
  "!**/build/**",
  "!**/scratch/**"
]
```

**Regra para evitar recorrência:**  
- Em projetos monorepo com Biome na raiz, sempre declarar diretórios de build e cache com a sintaxe `!**/<nome-da-pasta>/**`.

---

## ERR-013 — Links e botões em azul padrão Ant Design (#1677ff) sobrescrevendo classes do Tailwind

**Data:** 2026-09-13  
**Arquivos:** `apps/web/src/utils/constants.ts`, `apps/web/src/app/globals.css`, `apps/web/src/ui/pages/publicPages/PublicSiteShell.tsx`  
**Erro (comportamento):**  
Textos de links e botões na navbar e na página pública ("Produto", "Planos", "Entrar", "Criar conta") aparecendo no azul padrão do Ant Design (`#1677ff`), ignorando classes utilitárias como `text-white`, `text-white/90` e `text-(--color-primary)`.

**Causa raiz:**  
1. O Ant Design 6 possui um seed token independente `colorLink` com valor padrão `#1677ff`. Sem definir `colorLink`, `colorLinkHover` e `colorLinkActive` em `TOKENS_BASE` e `THEMES_ANTD`, o Ant Design gera regras CSS dinâmicas em runtime no `<head>` com seletores para `a`.
2. Conforme a especificação CSS Cascade Layers (nível 5), estilos declarados fora de `@layer` (unlayered) têm prioridade obrigatória sobre estilos declarados dentro de `@layer` normais (como `@layer utilities` do Tailwind v4). Por isso, mesmo que a classe `.text-white` estivesse no elemento, o `a { color: #1677ff }` do Ant Design vencia a cascata.

**Correção aplicada:**  
1. Declarar `colorLink`, `colorLinkHover` e `colorLinkActive` em `TOKENS_BASE` e `THEMES_ANTD` no `src/utils/constants.ts` com as cores do tema (verde floresta/esmeralda).
2. Mover estilos base de links em `globals.css` para dentro de `@layer base`.
3. Usar utilitários com `!` (ex: `!text-white`, `!text-emerald-800`) e encapsular os rótulos textuais de links e botões em `<span>` dedicados, evitando qualquer interferência de seletores `a`.

**Regra para evitar recorrência:**  
- Sempre configurar `colorLink` em todos os temas do Ant Design em harmonia com `colorPrimary`.
- Em componentes com elementos `<a>` ou `<Link>` que devam ter cor contrastante específica (como navbar verde com texto branco), usar `!text-*` e preferir encapsular o texto em `<span>`.

---

*Última atualização: 2026-09-13*





