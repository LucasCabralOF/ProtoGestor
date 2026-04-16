# One-pager de produto

## Nome de trabalho

`Proto`

## Resumo

`Proto` e um SaaS multi-tenant para pequenas empresas de servicos recorrentes e atendimento em campo. O produto organiza clientes, agenda, ordens de servico, financeiro basico e indicadores operacionais em um unico painel, com foco em simplicidade e rapidez de implantacao.

## Categoria

- SaaS vertical de gestao operacional para servicos recorrentes
- Nao e ERP completo
- Nao e CRM generico
- Nao deve ficar preso a um nicho unico por causa da seed

## Para quem

- Empresas de 1 a 10 pessoas
- Operacoes com 30 a 200 clientes ativos
- Negocios que atendem no local do cliente ou por visitas agendadas
- Times que ainda dependem de planilhas, WhatsApp, agenda manual e historico solto

## Segmentos com melhor aderencia

- dedetizacao
- manutencao preventiva
- climatizacao e manutencao de ar-condicionado
- jardinagem e paisagismo recorrente
- facilities e servicos prediais
- assistencia tecnica local
- outros servicos sob contrato ou recorrencia

## Dor principal

O cliente ideal perde tempo e receita por desorganizacao operacional.

Sinais dessa dor:

- esquece retornos e recorrencias
- nao tem historico confiavel por cliente
- agenda equipe sem visao consolidada
- cobra de forma manual e atrasada
- nao sabe o que esta agendado, executado, pendente ou atrasado

## Promessa central

"Organize a operacao de servicos recorrentes em um so lugar, sem depender de planilha, papel ou controle espalhado."

## Modulo que vende o produto

O coracao comercial do produto e a combinacao de:

- clientes
- agenda recorrente
- ordens de servico
- financeiro basico

Essa combinacao resolve a dor principal com uma proposta simples de entender e facil de vender.

## MVP vendavel

Escopo recomendado para a primeira versao vendavel:

1. Cadastro de clientes e contatos
2. Agenda de visitas e recorrencias
3. Ordens de servico com status, valor e local de atendimento
4. Contas a receber e visao financeira basica
5. Dashboard e relatorios operacionais
6. Autenticacao, multi-tenant e contexto de organizacao

## O que nao entra agora

- ERP completo
- estoque
- emissao fiscal
- app tecnico offline completo
- GPS e roteirizacao
- WhatsApp oficial
- integracoes pagas
- API publica
- white-label
- IA

## Diferenciais desejados

- setup rapido
- interface simples para pequenos times
- foco operacional em vez de burocracia fiscal
- multi-tenant pronto para vender como SaaS
- base bilingue (`pt-BR` e `en`) desde o inicio

## Como o estado atual do projeto se encaixa

- A base multi-tenant ja existe com `Organization` + `Membership`
- `clients` ja entrega cadastro, filtros, importacao e exportacao
- `services` ja aproxima o fluxo de ordem de servico, status e agendamento
- `reports` ja aponta para o valor de operacao + financeiro basico
- `projects` ainda deve ser tratado como exploratorio e nao como modulo principal do produto
- agenda e financeiro ja existem no schema, mas ainda precisam evoluir como modulos dedicados

## Regra de posicionamento

Exemplos da seed sao apenas dados ilustrativos. Eles nao definem o nicho do produto.

Ao escrever copy, docs ou UX, prefira termos genericos como:

- cliente
- visita
- tecnico ou equipe
- agenda
- recorrencia
- ordem de servico
- cobranca
- operacao

## Roadmap de produto

### Fase 1: MVP vendavel

- fechar fluxo clientes -> agenda -> OS -> cobranca
- consolidar relatorios essenciais
- melhorar onboarding e dados demo

### Fase 2: Operacao assistida

- recorrencia configuravel
- lembretes e follow-up
- mais contexto por cliente e historico de atendimento

### Fase 3: Escala comercial

- papeis mais granulares
- multi-filial quando houver demanda real
- integracoes pagas apenas apos validacao de vendas

## Documentos relacionados

- [Copy de landing page](/home/app/docs/landing-page-copy.md)
- [Backlog priorizado do MVP](/home/app/docs/mvp-backlog.md)
- [Proposta inicial de planos e preco](/home/app/docs/pricing-strategy.md)
