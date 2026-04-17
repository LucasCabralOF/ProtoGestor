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

*Última atualização: 2026-04-17*
