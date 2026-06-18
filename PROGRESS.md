# Progresso — Frontend ERP StudioKasa

Checklist do que já foi implementado no frontend. Atualizado conforme avançamos.

Legenda: ✅ feito · 🟡 parcial · ⬜ pendente

---

## Fundação (Fase 0)

- ✅ Scaffold Vite + React 19 + TypeScript
- ✅ Tailwind v4 + shadcn/ui (new-york)
- ✅ Tema StudioKasa (tokens de cor, Plus Jakarta Sans, radius)
- ✅ Tokens de status (info/success/warning/danger/neutral)
- ✅ Alias `@/` → `src/`
- ✅ Estrutura de pastas (pages, layouts, components, features, lib, types)
- ✅ Layout autenticado (sidebar com seções + topbar)
- ✅ Layout público (auth-layout com a marca)
- ✅ Logos da marca (wordmark + monograma)
- ✅ Favicon + título + `lang=pt-BR`
- ✅ Repositório Git + GitHub

### Helpers / infra de UI

- ✅ `lib/format` — BRL, datas, CPF/CNPJ, iniciais
- ✅ `lib/permissions` — RBAC (papéis, permissões, alçada de desconto)
- ✅ `lib/nav` — navegação em seções
- ✅ Auth mock (`features/auth`) — pronto pra trocar por Inertia

### Componentes reutilizáveis

- ✅ shadcn: Button, Card, Input, Label, Avatar, Badge, Dropdown, Separator, Tooltip, Sonner
- ✅ StatusBadge (pills de workflow)
- ✅ StatCard (KPI com variação)
- ✅ NameAvatar (avatar de iniciais)
- ✅ PageHeader (com breadcrumb)
- ✅ **DataTable** (TanStack) — busca, ordenação, paginação, estado vazio
- ✅ Dialog / Sheet / AlertDialog (modais de criar/editar/confirmar)
- ✅ Form (react-hook-form + zod) + Select, Checkbox, Switch, Tabs
- ⬜ Combobox / Command (busca de cliente/produto)
- ⬜ DatePicker, Textarea, máscaras (moeda/CPF/CNPJ/telefone), Skeleton

---

## Telas / Módulos

| # | Módulo | Status | Observação |
|---|--------|--------|------------|
| — | Login | ✅ | Mock; com a marca e lista de recursos |
| — | Dashboard | ✅ | KPIs, projetos recentes, agenda (dados mock) |
| 0 | Administração | 🟡 | Usuários e Perfis (CRUD completo); Permissões/Fiscal/Desconto pendentes |
| 1 | CRM e Vendas | 🟡 | Funil Kanban (mover etapa), Clientes (CRUD), Oportunidades. Falta: propostas/contratos, ranking, WhatsApp, assinatura |
| 2 | Projetos | 🟡 | Quadro Kanban por etapa, lista (CRUD), ficha com versões e peças. Falta: integração 3D, chat, biblioteca |
| 3 | Medição e Conferência | 🟡 | Agenda, agendar, ficha com checklist, comparação vendido×conferido e alçada. Falta: app mobile, OCR, contrato complementar |
| 4 | Pedido ao Fornecedor | 🟡 | Lista, criar pedido, ficha com itens, avanço de status, atraso e divergências. Falta: portal/API fornecedor, previsão IA |
| 5 | Compras e Suprimentos | 🟡 | Cotações (comparar/escolher), sugestões por estoque mínimo, histórico de preços. Falta: XML NF-e, 3-way match, portal fornecedor |
| 6 | Estoque e WMS | 🟡 | Itens (saldo/endereço/status), movimentação→Kardex, inventário físico×sistema. Falta: código de barras/RFID, transferência entre filiais, IA demanda |
| 7 | Financeiro | 🟡 | A pagar/receber (baixar), comissões (liberar/pagar), fluxo previsto×realizado. Falta: CNAB/boleto/PIX, conciliação, DRE |
| 8 | Fiscal e Contábil | 🟡 | Notas emitidas (impostos c/ IBS-CBS, cancelar/retransmitir), entradas (escriturar/crédito), certificado A1 + SEFAZ. Falta: emissão real, SPED, integração contábil |
| 9 | Logística e Montagem | 🟡 | Ordens (entrega/montagem), checklist por fase, check-in/out, avarias, equipes. Falta: roteirização, app de campo, ETA |
| 10 | Pós-venda | 🟡 | Chamados (atender/solicitar peça/encerrar), garantias com vencimento, NPS. Falta: chatbot WhatsApp, app de campo, análise de sentimento |
| 11 | Marketing | ⬜ | fora da sidebar atual |
| 12 | Portal do Cliente | ⬜ | fora da sidebar atual |
| 13 | BI e Dashboards | ⬜ | placeholder |
| 14 | RH e Pessoas | ⬜ | fora da sidebar atual |

---

## Pendências transversais (do MELHORIAS.md)

- ⬜ Camada de dados (TanStack Query + apiClient) — decidir Inertia puro vs API JSON
- ⬜ Padrão de formulários (react-hook-form + zod)
- ⬜ Busca global Command-K na topbar
- ⬜ Sidebar colapsável
- ⬜ Toggle de tema claro/escuro
- ⬜ Code-splitting por rota (React.lazy)
- ⬜ Testes (Vitest + Testing Library)
- ⬜ Plugar no backend Laravel + Inertia
