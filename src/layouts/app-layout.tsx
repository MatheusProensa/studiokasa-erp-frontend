import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/features/auth/auth-context'
import { canAccess } from '@/lib/access'

function AcessoNegado() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Lock className="size-6 text-muted-foreground" />
        </span>
        <p className="text-lg font-semibold">Acesso restrito</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Seu perfil não tem permissão para esta tela. Fale com a administração se precisar de
          acesso.
        </p>
      </CardContent>
    </Card>
  )
}

/** Shell autenticado: sidebar + topbar. Protege rotas por perfil (RBAC). */
export function AppLayout() {
  const { user } = useAuth()
  const { pathname } = useLocation()

  if (!user) return <Navigate to="/login" replace />

  const liberado = canAccess(user, pathname)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-[var(--muted)]/60 p-4 sm:p-6 lg:px-8 lg:py-7">
          <div className="mx-auto w-full max-w-[1400px]">
            {liberado ? <Outlet /> : <AcessoNegado />}
          </div>
        </main>
      </div>
    </div>
  )
}
