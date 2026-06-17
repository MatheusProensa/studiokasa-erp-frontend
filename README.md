# StudioKasa ERP — Frontend

Frontend do ERP da StudioKasa. Construído **standalone** (Vite) para depois ser plugado
no backend **Laravel + Inertia.js** do projeto.

## Stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** (design tokens da marca StudioKasa)
- **shadcn/ui** (componentes próprios, base Radix UI)
- **react-router-dom** — provisório, será substituído pelo roteamento do Inertia
- **lucide-react** — ícones

## Identidade visual

Tokens em [`src/index.css`](src/index.css):

| Token | Cor | Uso |
|---|---|---|
| `--primary` | `#0D2150` | Azul escuro StudioKasa |
| `--secondary` | `#1E4D8C` | Azul médio |
| `--background` | `#FFFFFF` | Fundo |
| `--radius` | `0.75rem` | Cantos arredondados |

Fonte: **Plus Jakarta Sans** (arredondada, moderna).

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + build de produção
```

Login é **mock** (qualquer e-mail/senha entra). Ver `src/features/auth/auth-context.tsx`.

## Estrutura

```
src/
├── pages/              # 1 arquivo = 1 tela (espelha as páginas do Inertia)
│   ├── auth/           #   login
│   └── dashboard/
├── layouts/            # app-layout (shell autenticado) e auth-layout
├── components/
│   ├── ui/             # shadcn (gerado via CLI)
│   └── layout/         # sidebar, topbar, page-header
├── features/           # lógica por domínio (auth, e futuramente adm/, crm/...)
├── lib/                # utils, format (BRL/datas/CPF-CNPJ), permissions (RBAC), nav
└── types/              # tipos globais (User, AccessRole, SharedProps)
```

## Como plugar no Laravel/Inertia (depois)

1. Mover `src/` para `resources/js/` no projeto Laravel.
2. Instalar `@inertiajs/react` e o plugin Laravel Vite; trocar `App.tsx`/router pelo
   `createInertiaApp` (resolução de páginas por nome em `pages/`).
3. Substituir o `AuthProvider` mock por `usePage().props.auth.user` (shared props
   definidas em `HandleInertiaRequests`). A interface `User` em `src/types` já está pronta.
4. Trocar `<NavLink>`/`useNavigate` pelos `<Link>`/`router` do Inertia.
5. RBAC: `src/lib/permissions.ts` já espelha o spatie/laravel-permission — basta alimentar
   `user.roles` e `user.permissions` via shared props. **A validação real é sempre no backend.**

## Roadmap (ordem dos módulos do ERP)

- [x] Fase 0 — Fundação (scaffold, tema, layout, auth mock, dashboard)
- [ ] Módulo 0 — Administração (usuários, perfis, permissões, parâmetros fiscais)
- [ ] Módulo 1 — CRM e Vendas
- [ ] ... demais módulos na sequência
