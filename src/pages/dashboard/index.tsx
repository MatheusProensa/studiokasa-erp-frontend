import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, FolderKanban, Package, Wallet,
  CalendarCheck, Truck, PenTool, Wrench, Users,
  Plus, Settings2, ArrowRight, AlertTriangle, Receipt,
} from 'lucide-react'
import { PersonalizarDashboardDialog, DEFAULT_PREFS, type DashboardPrefs } from '@/features/dashboard/personalizar-dialog'
import { NovoAtalhoDialog, type Atalho } from '@/features/dashboard/novo-atalho-dialog'
import type { LucideIcon } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/patterns/stat-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import { useAuth } from '@/features/auth/auth-context'
import { RECENT_PROJECTS, WEEK_AGENDA } from '@/features/dashboard/mock-data'
import { formatBRL } from '@/lib/format'

const AGENDA_ICONS: Record<string, LucideIcon> = {
  'calendar-check': CalendarCheck,
  truck: Truck,
  'pen-tool': PenTool,
  wrench: Wrench,
}

const ACESSOS_RAPIDOS = [
  { icon: FolderKanban, label: 'Novo projeto', color: 'text-primary', rota: '/projetos' },
  { icon: Receipt, label: 'Nova venda', color: 'text-emerald-600', rota: '/crm' },
  { icon: Users, label: 'Novo cliente', color: 'text-sky-600', rota: '/crm' },
  { icon: CalendarCheck, label: 'Nova medição', color: 'text-amber-600', rota: '/medicao' },
  { icon: Truck, label: 'Emitir pedido', color: 'text-violet-600', rota: '/pedidos' },
  { icon: TrendingUp, label: 'Relatórios', color: 'text-slate-500', rota: '/bi' },
]

const ALERTAS = [
  { icon: AlertTriangle, iconColor: 'text-amber-500', label: '2 projetos aguardando medição', sub: 'Helena Moretti, Construtora Vega', acao: 'Ver projetos', rota: '/projetos', tone: 'warning' as const },
  { icon: Package, iconColor: 'text-red-500', label: '5 pedidos aguardando aprovação', sub: 'Total: R$ 85.430,00', acao: 'Ver pedidos', rota: '/pedidos', tone: 'danger' as const },
  { icon: Truck, iconColor: 'text-orange-500', label: '3 entregas em atraso', sub: 'Rafael Nunes, Juliana Costa', acao: 'Ver entregas', rota: '/logistica', tone: 'danger' as const },
]

const RESUMO_FINANCEIRO = [
  { label: 'A receber', valor: 96200, cor: 'text-[var(--status-success)]' },
  { label: 'A pagar', valor: 83320, cor: 'text-orange-500' },
  { label: 'Saldo disponível', valor: 112450, cor: 'text-[var(--status-success)]' },
  { label: 'Comissões a pagar', valor: 13415, cor: 'text-orange-500' },
]

const NOTA_PERIODO: Record<DashboardPrefs['periodo'], string> = {
  semana: 'vs. semana anterior',
  mes: 'vs. mês anterior',
  trimestre: 'vs. trimestre anterior',
}

const STAT_GRID_CLASS: Record<DashboardPrefs['layout'], string> = {
  padrao: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
  compacto: 'grid gap-4 sm:grid-cols-2',
  expandido: 'grid gap-4 grid-cols-1',
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const firstName = user?.name.split(' ')[0] ?? ''
  const [personalizarOpen, setPersonalizarOpen] = useState(false)
  const [novoAtalhoOpen, setNovoAtalhoOpen] = useState(false)
  const [prefs, setPrefs] = useState<DashboardPrefs>(DEFAULT_PREFS)
  const [atalhos, setAtalhos] = useState<Atalho[]>(ACESSOS_RAPIDOS)
  const notaPeriodo = NOTA_PERIODO[prefs.periodo]

  return (
    <div>
      <PageHeader
        breadcrumb="Início · Dashboard"
        title={`Olá, ${firstName} 👋`}
        description="Visão geral do ERP StudioKasa."
        actions={
          <>
            <Button variant="outline" onClick={() => setPersonalizarOpen(true)}>
              <Settings2 className="size-4" />
              Personalizar dashboard
            </Button>
            <Button onClick={() => setNovoAtalhoOpen(true)}>
              <Plus className="size-4" />
              Novo atalho
            </Button>
          </>
        }
      />

      <div className={STAT_GRID_CLASS[prefs.layout]}>
        <StatCard label="Vendas no mês" value="R$ 184.500" icon={TrendingUp} delta="+12,2%" deltaNote={notaPeriodo} />
        <StatCard
          label="Projetos ativos"
          value="23"
          icon={FolderKanban}
          delta="+3 projetos"
          deltaNote="63% da capacidade"
        />
        <StatCard label="Itens em estoque" value="1.842" icon={Package} delta="+1,2%" deltaNote={notaPeriodo} />
        <StatCard label="A receber" value="R$ 96.200" icon={Wallet} delta="-4,4%" deltaDirection="down" deltaNote={notaPeriodo} />
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between pb-3">
          <span className="font-semibold">Acessos rápidos</span>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setNovoAtalhoOpen(true)}>
            <Plus className="size-3 mr-1" /> Adicionar
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">
            {atalhos.map(({ icon: Icon, label, color, rota }) => (
              <button
                key={label}
                className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                onClick={() => navigate(rota)}
              >
                <Icon className={`size-4 shrink-0 ${color}`} />
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-4">
            <div>
              <p className="text-base font-semibold">Projetos recentes</p>
              <p className="text-sm text-muted-foreground">Pipeline de produção e entrega</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate('/projetos')}>
              Ver todos
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2.5 font-semibold">Cliente</th>
                  <th className="px-5 py-2.5 font-semibold">Ambiente</th>
                  <th className="px-5 py-2.5 font-semibold">Projetista</th>
                  <th className="px-5 py-2.5 font-semibold">Etapa</th>
                  <th className="px-5 py-2.5 text-right font-semibold">Valor</th>
                  <th className="px-5 py-2.5 font-semibold">Entrega</th>
                  <th className="px-5 py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_PROJECTS.map((p) => (
                  <tr key={p.cliente + p.ambiente} className="border-b last:border-0 transition-colors hover:bg-accent/50">
                    <td className="px-5 py-3 font-medium">{p.cliente}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.ambiente}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <NameAvatar name={p.projetista} size="sm" />
                        {p.projetista}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full" style={{ backgroundColor: `var(--status-${p.etapaTone})` }} />
                        {p.etapa}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums">{p.valor}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.entrega}</td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={p.status.tone} className="whitespace-nowrap">
                        {p.status.label}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t px-5 py-3 text-xs text-muted-foreground">
              <span>Mostrando 1 a 5 de 12 resultados</span>
              <div className="flex items-center gap-2">
                <button className="rounded border px-2 py-1 hover:bg-accent">‹</button>
                <button className="rounded bg-primary px-2 py-1 text-white">1</button>
                <button className="rounded border px-2 py-1 hover:bg-accent">2</button>
                <button className="rounded border px-2 py-1 hover:bg-accent">3</button>
                <button className="rounded border px-2 py-1 hover:bg-accent">›</button>
                <span className="ml-2 text-muted-foreground">5 / página</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {prefs.mostrarAgenda && (
            <Card>
              <CardHeader className="flex-row items-center justify-between pb-3">
                <span className="font-semibold">Agenda da semana</span>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => navigate('/medicao')}>
                  Ver agenda <ArrowRight className="size-3 ml-1" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-1">
                {WEEK_AGENDA.map((item) => {
                  const Icon = AGENDA_ICONS[item.icon] ?? CalendarCheck
                  return (
                    <div key={item.title} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                        <Icon className="size-4" />
                      </span>
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground">{item.when}</span>
                      </div>
                    </div>
                  )
                })}
                <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => navigate('/medicao')}>
                  Ver todas as atividades <ArrowRight className="size-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          )}

          {prefs.mostrarFinanceiro && (
            <Card>
              <CardHeader className="flex-row items-center justify-between pb-3">
                <span className="font-semibold">Resumo financeiro</span>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => navigate('/financeiro')}>
                  Ver relatório <ArrowRight className="size-3 ml-1" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {RESUMO_FINANCEIRO.map((r) => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className={`font-semibold tabular-nums ${r.cor}`}>{formatBRL(r.valor)}</span>
                  </div>
                ))}
                <div className="mt-2 rounded-lg bg-accent/50 p-2 text-xs text-muted-foreground">
                  <span className="text-[var(--status-success)]">●</span>{' '}
                  Fluxo de caixa previsto para os próximos 7 dias: {formatBRL(42850)}
                </div>
              </CardContent>
            </Card>
          )}

          {!prefs.mostrarAgenda && !prefs.mostrarFinanceiro && (
            <Card>
              <CardContent className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                Nenhum painel lateral selecionado. Ative em "Personalizar dashboard".
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {prefs.mostrarAlertas && (
        <div className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <span className="font-semibold">Alertas e pendências</span>
            </CardHeader>
            <CardContent className="space-y-3">
              {ALERTAS.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <a.icon className={`size-5 shrink-0 ${a.iconColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.sub}</p>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0 text-xs" onClick={() => navigate(a.rota)}>
                    {a.acao}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      <PersonalizarDashboardDialog open={personalizarOpen} onOpenChange={setPersonalizarOpen} value={prefs} onSave={setPrefs} />
      <NovoAtalhoDialog open={novoAtalhoOpen} onOpenChange={setNovoAtalhoOpen} onAdded={(a) => setAtalhos((prev) => [...prev, a])} />
    </div>
  )
}
