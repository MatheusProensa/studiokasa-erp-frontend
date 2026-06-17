import { useNavigate } from 'react-router-dom'
import { LogOut, Search, Bell, CircleHelp, Calendar, ChevronDown, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NameAvatar } from '@/components/ui/name-avatar'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/features/auth/auth-context'
import type { AccessRole } from '@/types'

const ROLE_LABEL: Record<AccessRole, string> = {
  projetista: 'Projetista',
  conferente: 'Conferente',
  estoquista: 'Estoquista',
  financeiro: 'Financeiro',
  marketing: 'Marketing',
  vendedor: 'Vendedor',
  supervisor: 'Supervisor',
  gerente: 'Gerente',
  diretor: 'Diretor(a)',
}

function todayLabel() {
  return new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function Topbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const roleLabel = user?.roles[0] ? ROLE_LABEL[user.roles[0]] : ''

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-card px-6">
      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar no ERP..." className="pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <span className="mr-1 hidden items-center gap-1.5 text-sm text-muted-foreground lg:flex">
          <Calendar className="size-[15px]" />
          {todayLabel()}
        </span>
        <Separator orientation="vertical" className="mx-1 hidden h-6 lg:block" />

        <Button variant="ghost" size="icon" aria-label="Ajuda">
          <CircleHelp className="size-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notificações" className="relative">
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-[var(--status-danger)] ring-2 ring-card" />
        </Button>

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
            <DropdownMenuItem>
              <User className="mr-2 size-4" />
              Meu perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 size-4" />
              Configurações
            </DropdownMenuItem>
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
