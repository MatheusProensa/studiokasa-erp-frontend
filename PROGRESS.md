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
- ⬜ **DataTable** (TanStack) — base de todos os CRUDs
- ⬜ Dialog / Sheet / AlertDialog (modais de criar/editar)
- ⬜ Select / Combobox / Command (busca de cliente/produto)
- ⬜ Form (react-hook-form + zod) + campos com máscara
- ⬜ DatePicker, Checkbox, Switch, Textarea, Tabs, Skeleton

---

## Telas / Módulos

| # | Módulo | Status | Observação |
|---|--------|--------|------------|
| — | Login | ✅ | Mock; com a marca e lista de recursos |
| — | Dashboard | ✅ | KPIs, projetos recentes, agenda (dados mock) |
| 0 | Administração | ⬜ | — |
| 1 | CRM e Vendas | 🟡 | Tela-modelo com KPIs + tabela de oportunidades (mock) |
| 2 | Projetos | ⬜ | placeholder |
| 3 | Medição e Conferência | ⬜ | placeholder |
| 4 | Pedido ao Fornecedor | ⬜ | placeholder |
| 5 | Compras e Suprimentos | ⬜ | placeholder |
| 6 | Estoque e WMS | ⬜ | placeholder |
| 7 | Financeiro | ⬜ | placeholder |
| 8 | Fiscal e Contábil | ⬜ | placeholder |
| 9 | Logística e Montagem | ⬜ | placeholder |
| 10 | Pós-venda | ⬜ | placeholder |
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
