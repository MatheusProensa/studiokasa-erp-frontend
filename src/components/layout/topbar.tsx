import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { LogOut, Search, Bell, CircleHelp, Calendar, ChevronDown, User, Settings, UserCog } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NameAvatar } from '@/components/ui/name-avatar'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/features/auth/auth-context'
import { ROLE_LABELS, ROLE_OPTIONS } from '@/lib/roles'
import type { AccessRole } from '@/types'
import { MobileNav } from './mobile-nav'
import { CommandPalette } from './command-palette'

const NOTIFICACOES = [
  { titulo: 'Medição bloqueada por alçada', desc: 'Construtora Vega — divergência de 15%' },
  { titulo: 'Pedido atrasado', desc: 'PC-2003 — Marcenaria Dália' },
  { titulo: 'Título vencido', desc: 'NF 1190 — Componentes RS' },
]

function todayLabel() {
  return new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export function Topbar() {
  const { user, logout, setRoles } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function verComo(role: AccessRole) {
    setRoles([role])
    navigate('/') // volta ao início pra não cair numa tela sem permissão
  }

  const roleLabel = user?.roles[0] ? ROLE_LABELS[user.roles[0]] : ''

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-card px-4 sm:px-6">
      <MobileNav />

      {/* Busca global */}
      <button
        onClick={() => setSearch(true)}
        className="flex h-9 w-full max-w-md items-center gap-2 rounded-lg border bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-accent"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Buscar no ERP...</span>
        <kbd className="ml-auto hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium sm:inline">
          Ctrl K
        </kbd>
      </button>
      <CommandPalette open={search} onOpenChange={setSearch} />

      <div className="ml-auto flex items-center gap-1.5">
        <span className="mr-1 hidden items-center gap-1.5 text-sm text-muted-foreground lg:flex">
          <Calendar className="size-[15px]" />
          {todayLabel()}
        </span>
        <Separator orientation="vertical" className="mx-1 hidden h-6 lg:block" />

        <Button variant="ghost" size="icon" aria-label="Ajuda" onClick={() => toast('Central de ajuda em breve.')}>
          <CircleHelp className="size-5" />
        </Button>

        {/* Notificações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notificações" className="relative">
              <Bell className="size-5" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-[var(--status-danger)] ring-2 ring-card" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {NOTIFICACOES.map((n) => (
              <DropdownMenuItem key={n.titulo} className="flex flex-col items-start gap-0.5">
                <span className="text-sm font-medium">{n.titulo}</span>
                <span className="text-xs text-muted-foreground">{n.desc}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full pl-1 pr-2 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
              <NameAvatar name={user?.name ?? '?'} />
              <span className="hidden flex-col items-start leading-tight sm:flex">
                <span className="text-sm font-semibold">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{roleLabel}</span>
              </span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <div className="flex items-center gap-3 p-2">
              <NameAvatar name={user?.name ?? '?'} size="lg" />
              <div className="flex flex-col leading-tight">
                <span className="font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.email}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/rh')}>
              <User className="mr-2 size-4" />
              Meu perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/adm')}>
              <Settings className="mr-2 size-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserCog className="mr-2 size-4" />
                Ver como (perfil)
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {ROLE_OPTIONS.map((r) => (
                  <DropdownMenuItem
                    key={r.value}
                    onClick={() => verComo(r.value)}
                    className={user?.roles[0] === r.value ? 'bg-accent' : undefined}
                  >
                    {r.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
