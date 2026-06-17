import { TrendingUp, FolderKanban, Package, Wallet, CalendarCheck, Truck, PenTool, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/patterns/stat-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import { useAuth } from '@/features/auth/auth-context'
import { RECENT_PROJECTS, WEEK_AGENDA } from '@/features/dashboard/mock-data'

const AGENDA_ICONS: Record<string, LucideIcon> = {
  'calendar-check': CalendarCheck,
  truck: Truck,
  'pen-tool': PenTool,
  wrench: Wrench,
}

export default function DashboardPage() {
  const { user } = useAuth()
  const firstName = user?.name.split(' ')[0] ?? ''

  return (
    <div>
      <PageHeader
        breadcrumb="Início · Dashboard"
        title={`Olá, ${firstName} 👋`}
        description="Visão geral do ERP StudioKasa."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Vendas no mês" value="R$ 184.500" icon={TrendingUp} delta="+12%" deltaNote="vs. mês anterior" />
        <StatCard label="Projetos ativos" value="23" icon={FolderKanban} delta="+3" deltaNote="esta semana" />
        <StatCard label="Itens em estoque" value="1.842" icon={Package} delta="+1,2%" deltaNote="entradas" />
        <StatCard label="A receber" value="R$ 96.200" icon={Wallet} delta="-4%" deltaDirection="down" deltaNote="vs. meta" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Projetos recentes */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Projetos recentes</CardTitle>
              <CardDescription>Pipeline de produção e entrega</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              Ver todos
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-2.5 font-semibold">Cliente</th>
                  <th className="px-6 py-2.5 font-semibold">Ambiente</th>
                  <th className="px-6 py-2.5 font-semibold">Projetista</th>
                  <th className="px-6 py-2.5 text-right font-semibold">Valor</th>
                  <th className="px-6 py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_PROJECTS.map((p) => (
                  <tr key={p.cliente} className="border-b last:border-0 transition-colors hover:bg-accent/50">
                    <td className="px-6 py-3 font-medium">{p.cliente}</td>
                    <td className="px-6 py-3 text-muted-foreground">{p.ambiente}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <NameAvatar name={p.projetista} size="sm" />
                        {p.projetista}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right tabular-nums">{p.valor}</td>
                    <td className="px-6 py-3">
                      <StatusBadge tone={p.status.tone}>{p.status.label}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Agenda da semana */}
        <Card>
          <CardHeader>
            <CardTitle>Agenda da semana</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {WEEK_AGENDA.map((item) => {
              const Icon = AGENDA_ICONS[item.icon] ?? CalendarCheck
              return (
                <div key={item.title} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.when}</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
