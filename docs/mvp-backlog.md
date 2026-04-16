# Backlog priorizado do MVP

## Objetivo

Levar o produto do estado atual para uma versao vendavel com foco em operacao de servicos recorrentes.

## Regra de decisao

Entram no MVP apenas itens que aumentam uma destas capacidades:

1. ativacao inicial
2. operacao do dia a dia
3. cobranca e percepcao de valor
4. confianca para vender

Se uma funcionalidade nao melhora um desses pontos, ela deve sair do MVP.

## Escopo comercial do MVP

O MVP vendavel deve fechar este fluxo:

cliente -> agenda/recorrencia -> ordem de servico -> cobranca -> relatorio

## Estado atual resumido

### Ja existe

- autenticacao e area privada
- multi-tenant por organizacao
- dashboard com dados demo
- `clients` com busca, filtros, modal e import/export
- `services` com busca, filtros, status e agendamento basico
- `reports` com agregacoes operacionais e financeiras
- base de testes unitarios e smoke E2E

### Ainda falta consolidar

- onboarding mais claro
- agenda/recorrencia como fluxo principal
- financeiro basico como modulo dedicado
- narrativa de venda publica
- preparo comercial do SaaS

## Prioridade P0

Itens sem os quais o produto ainda nao deve ser vendido de forma ativa.

### P0.1 Landing page publica e narrativa de venda

**Objetivo**

Explicar claramente o que o produto resolve e capturar interesse comercial.

**Entregas**

- home publica com proposta de valor
- secao de funcionalidades
- secao de segmentos atendidos
- CTA para teste ou demonstracao
- pagina simples de planos

**Impacto**

Sem isso, o produto existe tecnicamente, mas nao existe comercialmente.

### P0.2 Onboarding inicial da conta

**Objetivo**

Levar uma conta nova ao primeiro valor percebido o mais rapido possivel.

**Entregas**

- onboarding apos signup
- criacao guiada da primeira organizacao quando necessario
- checklist inicial
- seed/demo mais neutra para mostrar uso generico

**Impacto**

Reduz abandono logo no primeiro acesso.

### P0.3 Agenda e recorrencia como fluxo principal

**Objetivo**

Transformar o agendamento em um recurso central, nao apenas um detalhe da OS.

**Entregas**

- listagem dedicada de agenda
- criacao de visitas futuras
- recorrencia simples
- filtros por periodo, status e cliente
- proximos atendimentos no dashboard

**Dependencia**

Reaproveitar `Appointment` e contexto tenant server-side ja existentes.

### P0.4 Ordem de servico com fluxo mais completo

**Objetivo**

Dar padrao minimo de execucao para o atendimento.

**Entregas**

- OS com status claros
- campo de observacoes operacionais
- historico por cliente
- valor e dados de atendimento mais visiveis
- ligacao mais clara entre visita e OS

**Impacto**

Essa e a parte que o cliente percebe como nucleo do sistema.

### P0.5 Financeiro basico dedicado

**Objetivo**

Permitir que a empresa acompanhe o minimo da cobranca dentro do produto.

**Entregas**

- contas a receber
- status `pending`, `paid` e `overdue`
- marcar pagamento
- filtros por periodo e status
- indicadores basicos de recebimento

**Observacao**

Nao incluir integracao com gateway no MVP.

### P0.6 Dashboard mais executivo

**Objetivo**

Mostrar em poucos blocos o estado da operacao.

**Entregas**

- proximas visitas
- OS por status
- recebimentos pendentes
- clientes ativos e recorrentes
- formatacao de moeda/data no server

### P0.7 Preparacao comercial do SaaS

**Objetivo**

Deixar o produto minimamente pronto para ser apresentado e cobrado.

**Entregas**

- pagina de planos
- termos simples de uso e privacidade
- CTA para teste ou contato
- modo de cobranca manual no inicio
- documentacao interna de demo e pitch

## Prioridade P1

Itens que aumentam muito a retencao e a operacao, mas podem entrar logo depois dos primeiros usuarios.

### P1.1 Melhorias em clientes

- tags mais uteis
- melhores validacoes
- historico consolidado por cliente
- UX melhor para acoes e importacao

### P1.2 Melhorias em services

- templates de servico
- recorrencia mais flexivel
- mais contexto por atendimento
- melhoria de UX mobile

### P1.3 Relatorios mais acionaveis

- comparativos por periodo
- ranking de clientes
- visao de receita recorrente versus avulsa
- exportacoes mais uteis

### P1.4 Gestao de equipe

- vincular atendimentos por tecnico
- papeis mais claros
- filtros por responsavel

### P1.5 Onboarding assistido

- organizacao exemplo mais polida
- dados de demonstracao mais genericos
- ajuda contextual nas telas principais

## Prioridade P2

Itens importantes, mas que devem esperar validacao comercial.

- WhatsApp oficial
- integracoes pagas
- automacoes externas
- app tecnico offline mais completo
- GPS e roteirizacao
- multi-filial mais sofisticado
- API publica
- white-label
- emissao fiscal
- estoque

## Sequencia recomendada

### Fase 1

- landing page publica
- pagina de planos
- onboarding inicial

### Fase 2

- agenda dedicada
- recorrencia simples
- melhoria do fluxo de OS

### Fase 3

- contas a receber
- dashboard executivo
- refinamento dos reports

### Fase 4

- ajustes de retencao
- experiencia mobile
- melhorias comerciais

## Criterios para considerar o MVP pronto

- uma conta nova consegue entender o produto sem explicacao tecnica
- o fluxo cliente -> visita -> OS -> cobranca funciona de ponta a ponta
- existe uma narrativa publica clara de venda
- existe um plano comercial simples para cobrar
- os dados principais da operacao sao visiveis no dashboard e nos reports

## O que nao fazer durante o MVP

- expandir `projects` como modulo principal
- perseguir features de ERP
- construir integracoes caras antes de validar venda
- adicionar complexidade de permissionamento alem do necessario

## Metrica de sucesso inicial

- tempo ate cadastrar o primeiro cliente
- tempo ate agendar a primeira visita
- tempo ate gerar a primeira OS
- tempo ate registrar o primeiro recebimento
- quantidade de contas que completam o fluxo principal
