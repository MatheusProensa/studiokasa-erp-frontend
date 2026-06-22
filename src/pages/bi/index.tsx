import { useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Percent, Receipt, TrendingUp, AlertCircle,
  Plus, LayoutDashboard, Download, CalendarClock, Share2, Settings2,
  Filter, ChevronDown, Users, ArrowRight, Truck,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NameAvatar } from '@/components/ui/name-avatar'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatBRL } from '@/lib/format'
import {
  VENDAS_MES,
  RANKING_VENDEDORES,
  CURVA_ABC,
  TERCEIRIZACAO,
} from '@/features/bi/mock-data'
import { FiltrosBiDialog, DEFAULT_BI_FILTROS, type BiFiltros } from '@/features/bi/filtros-bi-dialog'

const ACOES_RAPIDAS = [
  { icon: Plus, label: 'Novo dashboard', color: 'text-primary' },
  { icon: LayoutDashboard, label: 'Adicionar indicador', color: 'text-sky-600' },
  { icon: Download, label: 'Importar dados', color: 'text-emerald-600' },
  { icon: CalendarClock, label: 'Agendar relatório', color: 'text-amber-600' },
  { icon: Share2, label: 'Compartilhar dashboard', color: 'text-violet-600' },
  { icon: Settings2, label: 'Configurações de BI', color: 'text-slate-500' },
]

const PERIODOS = [
  { key: 'semana', label: 'Esta semana', range: '15/06/2026 – 21/06/2026', mult: 0.22 },
  { key: 'mes', label: 'Este mês', range: '01/06/2026 – 19/06/2026', mult: 1 },
  { key: 'trimestre', label: 'Último trimestre', range: '01/04/2026 – 19/06/2026', mult: 3 },
  { key: 'ano', label: 'Este ano', range: '01/01/2026 – 19/06/2026', mult: 6 },
] as const

type PeriodoKey = typeof PERIODOS[number]['key'] | 'custom'

/** Indicadores variam por período para refletir a seleção do usuário (mock). */
const PERIOD_METRICS: Record<PeriodoKey, { conversao: number; deltaConversao: string; ticketMedio: number; deltaTicket: string; margemMedia: number; deltaMargem: string; inadimplencia: number; deltaInad: string }> = {
  semana: { conversao: 31, deltaConversao: '+2 p.p.', ticketMedio: 45800, deltaTicket: '+3,1%', margemMedia: 26, deltaMargem: '+1 p.p.', inadimplencia: 3.8, deltaInad: '-0,2 p.p.' },
  mes: { conversao: 34, deltaConversao: '+4 p.p.', ticketMedio: 48200, deltaTicket: '+8,6%', margemMedia: 27, deltaMargem: '+2 p.p.', inadimplencia: 4.2, deltaInad: '-0,6 p.p.' },
  trimestre: { conversao: 36, deltaConversao: '+6 p.p.', ticketMedio: 51200, deltaTicket: '+11,4%', margemMedia: 29, deltaMargem: '+4 p.p.', inadimplencia: 4.6, deltaInad: '-1,1 p.p.' },
  ano: { conversao: 33, deltaConversao: '+5 p.p.', ticketMedio: 47650, deltaTicket: '+9,8%', margemMedia: 28, deltaMargem: '+3 p.p.', inadimplencia: 5.1, deltaInad: '-0,4 p.p.' },
  custom: { conversao: 34, deltaConversao: '+4 p.p.', ticketMedio: 48200, deltaTicket: '+8,6%', margemMedia: 27, deltaMargem: '+2 p.p.', inadimplencia: 4.2, deltaInad: '-0,6 p.p.' },
}

const CLASSE_TONE = {
  A: 'var(--status-success)',
  B: 'var(--status-warning)',
  C: 'var(--status-neutral)',
}

function VendasAreaChart({ data }: { data: typeof VENDAS_MES }) {
  const id = useId()
  const w = 600
  const h = 180
  const padL = 60
  const padB = 30
  const padR = 10
  const padT = 10
  const chartW = w - padL - padR
  const chartH = h - padB - padT

  const maxV = Math.max(...data.map((d) => d.valor))
  const minV = 0
  const range = maxV - minV || 1

  const pts = data.map((d, i) => ({
    x: padL + (i / (data.length - 1)) * chartW,
    y: padT + chartH - ((d.valor - minV) / range) * chartH,
    d,
  }))

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${pts[pts.length - 1].x},${h - padB} L${pts[0].x},${h - padB} Z`

  const yLabels = [0, 50000, 100000, 150000, 200000, 250000]

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: 180 }}>
      <defs>
        <linearGradient id={`bi-area-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      {yLabels.map((v) => {
        const y = padT + chartH - ((v - minV) / range) * chartH
        return (
          <g key={v}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="var(--border)" strokeWidth="1" />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="var(--muted-foreground)">
              {v === 0 ? 'R$ 0' : `R$ ${v / 1000}k`}
            </text>
          </g>
        )
      })}
      {pts.map((p) => (
        <text key={p.d.mes} x={p.x} y={h - padB + 14} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
          {p.d.mes}
        </text>
      ))}
      <path d={areaPath} fill={`url(#bi-area-${id})`} />
      <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p) => (
        <circle key={p.d.mes} cx={p.x} cy={p.y} r="4" fill="var(--primary)" stroke="white" strokeWidth="2" />
      ))}
    </svg>
  )
}

export default function BiPage() {
  const navigate = useNavigate()
  const [filtrosOpen, setFiltrosOpen] = useState(false)
  const [filtros, setFiltros] = useState<BiFiltros>(DEFAULT_BI_FILTROS)
  const [periodoKey, setPeriodoKey] = useState<PeriodoKey>('mes')
  const [customOpen, setCustomOpen] = useState(false)
  const [customRange, setCustomRange] = useState({ de: '', ate: '' })
  const [customLabel, setCustomLabel] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function compartilharDashboard() {
    const url = `${window.location.origin}/bi`
    navigator.clipboard.writeText(url).then(
      () => toast.success('Link copiado para a área de transferência.'),
      () => toast.error('Não foi possível copiar o link.'),
    )
  }

  function handleImportarDados() {
    const ultimo = VENDAS_MES[VENDAS_MES.length - 1]
    const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const proximoMes = MESES[(MESES.indexOf(ultimo.mes) + 1) % 12]
    VENDAS_MES.push({ mes: proximoMes, valor: Math.round(ultimo.valor * 1.05) })
    setDataTick((t) => t + 1)
    toast.success(`Dados importados — mês de ${proximoMes} adicionado ao gráfico.`)
  }

  const periodo = periodoKey === 'custom'
    ? { key: 'custom' as const, label: 'Período personalizado', range: customLabel || 'Selecione as datas', mult: 1 }
    : PERIODOS.find((p) => p.key === periodoKey) ?? PERIODOS[1]
  const metrics = PERIOD_METRICS[periodoKey]
  const [dataTick, setDataTick] = useState(0)

  const vendasData = useMemo(
    () => VENDAS_MES.map((d) => ({ ...d, valor: Math.round(d.valor * periodo.mult) })),
    [periodo, dataTick],
  )
  const rankingData = useMemo(
    () => RANKING_VENDEDORES
      .filter((r) => filtros.vendedor === 'Todos' || r.nome === filtros.vendedor)
      .map((r) => ({ ...r, valor: Math.round(r.valor * periodo.mult) })),
    [periodo, filtros.vendedor],
  )

  const totalPeriodo = vendasData.reduce((s, v) => s + v.valor, 0)
  const melhorMes = vendasData.reduce((a, b) => (a.valor > b.valor ? a : b))
  const mediaMensal = Math.round(totalPeriodo / vendasData.length)
  const maxRank = Math.max(...rankingData.map((r) => r.valor), 1)

  function aplicarPeriodoPersonalizado() {
    if (!customRange.de || !customRange.ate) {
      toast.error('Selecione as duas datas.')
      return
    }
    const fmt = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR')
    setCustomLabel(`${fmt(customRange.de)} – ${fmt(customRange.ate)}`)
    setPeriodoKey('custom')
    setCustomOpen(false)
    toast.success('Período personalizado aplicado.')
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => { if (e.target.files?.length) handleImportarDados(); e.target.value = '' }}
      />
      <PageHeader
        breadcrumb="Geral · BI e Dashboards"
        title="BI e Dashboards"
        description="Indicadores gerenciais consolidados."
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <CalendarClock className="size-4" />
                  {periodo.range}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {PERIODOS.map((p) => (
                  <DropdownMenuItem key={p.key} onClick={() => setPeriodoKey(p.key)}>
                    {p.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem onClick={() => setCustomOpen(true)}>
                  Período personalizado…
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={() => setFiltrosOpen(true)}>
              <Filter className="size-4" />
              Filtros
            </Button>
            <Button onClick={() => toast.success('Novo dashboard criado: "Dashboard personalizado". Acesse em Configurações de BI para editar.')}>
              <Plus className="size-4" />
              Novo dashboard
              <ChevronDown className="size-4" />
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Conversão"
          value={`${metrics.conversao}%`}
          icon={Percent}
          delta={metrics.deltaConversao}
          deltaNote="vs. período anterior"
          className={filtros.metrica === 'Conversão' ? 'ring-2 ring-primary' : undefined}
        />
        <StatCard
          label="Ticket médio"
          value={formatBRL(metrics.ticketMedio)}
          icon={Receipt}
          delta={metrics.deltaTicket}
          deltaNote="vs. período anterior"
          className={filtros.metrica === 'Ticket médio' ? 'ring-2 ring-primary' : undefined}
        />
        <StatCard
          label="Margem média"
          value={`${metrics.margemMedia}%`}
          icon={TrendingUp}
          tone="success"
          delta={metrics.deltaMargem}
          deltaNote="vs. período anterior"
          className={filtros.metrica === 'Margem média' ? 'ring-2 ring-primary' : undefined}
        />
        <StatCard
          label="Inadimplência"
          value={`${metrics.inadimplencia}%`}
          icon={AlertCircle}
          tone="danger"
          delta={metrics.deltaInad}
          deltaNote="vs. período anterior"
          deltaDirection="down"
          className={filtros.metrica === 'Inadimplência' ? 'ring-2 ring-primary' : undefined}
        />
      </div>

      <Card className="mt-6">
        <CardHeader className="pb-3">
          <span className="font-semibold">Ações rápidas</span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">
            {ACOES_RAPIDAS.map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                onClick={() => {
                  if (label === 'Novo dashboard') toast.success('Novo dashboard criado. Acesse Configurações de BI para editar.')
                  else if (label === 'Adicionar indicador') toast.success('Indicador adicionado ao dashboard atual.')
                  else if (label === 'Importar dados') fileInputRef.current?.click()
                  else if (label === 'Agendar relatório') toast.success('Relatório agendado: você receberá por e-mail toda segunda-feira às 8h.')
                  else if (label === 'Compartilhar dashboard') compartilharDashboard()
                  else if (label === 'Configurações de BI') navigate('/adm')
                }}
              >
                <Icon className={`size-4 ${color}`} />
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <span className="font-semibold">Vendas por mês</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Valor (R$) <ChevronDown className="ml-1 size-3" />
              </Button>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => navigate('/crm')}>
                Ver relatório <ArrowRight className="size-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <VendasAreaChart data={vendasData} />
            <div className="mt-4 grid grid-cols-4 gap-4 border-t pt-4">
              <div>
                <p className="text-xs text-muted-foreground">Total no período</p>
                <p className="text-lg font-bold tabular-nums">{formatBRL(totalPeriodo)}</p>
                <p className="text-xs text-[var(--status-success)]">↑ 12,2% vs. período anterior</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Melhor mês</p>
                <p className="text-lg font-bold">{melhorMes.mes}</p>
                <p className="text-xs text-muted-foreground tabular-nums">{formatBRL(melhorMes.valor)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Média mensal</p>
                <p className="text-lg font-bold tabular-nums">{formatBRL(mediaMensal)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Meta no período</p>
                <p className="text-lg font-bold tabular-nums">{formatBRL(1050000)}</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: '103%' }} />
                  </div>
                  <span className="text-xs font-semibold text-[var(--status-success)]">103%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <span className="font-semibold">Terceirização</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => navigate('/pedidos')}>
              Ver relatório <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: Truck, label: 'Prazo médio fornecedor', valor: `${TERCEIRIZACAO.prazoMedioDias} dias`, cor: '' },
              { icon: CalendarClock, label: 'Pedidos no prazo', valor: `${TERCEIRIZACAO.pedidosNoPrazo}%`, cor: 'text-[var(--status-success)]' },
              { icon: TrendingUp, label: 'OTIF', valor: `${TERCEIRIZACAO.otif}%`, cor: 'text-[var(--status-success)]' },
              { icon: AlertCircle, label: 'Divergências', valor: String(TERCEIRIZACAO.divergencias), cor: 'text-orange-500' },
            ].map(({ icon: Icon, label, valor, cor }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <span className="flex-1 text-sm text-muted-foreground">{label}</span>
                <span className={`font-bold tabular-nums ${cor}`}>{valor}</span>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => navigate('/pedidos')}>
              <Users className="size-4" />
              Gerenciar fornecedores
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <span className="font-semibold">Ranking de vendedores</span>
          </CardHeader>
          <CardContent className="space-y-3">
            {rankingData.map((r) => (
              <div key={r.nome} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <NameAvatar name={r.nome} size="sm" />
                    {r.nome}
                  </span>
                  <span className="tabular-nums font-semibold">{formatBRL(r.valor)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-[var(--secondary)]" style={{ width: `${(r.valor / maxRank) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <span className="font-semibold">Curva ABC — clientes</span>
          </CardHeader>
          <CardContent className="space-y-2">
            {CURVA_ABC.map((c) => (
              <div key={c.nome} className="flex items-center justify-between rounded-lg border p-2.5 text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className="flex size-6 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: CLASSE_TONE[c.classe] }}
                  >
                    {c.classe}
                  </span>
                  {c.nome}
                </span>
                <span className="tabular-nums font-medium">{formatBRL(c.valor)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <FiltrosBiDialog open={filtrosOpen} onOpenChange={setFiltrosOpen} value={filtros} onApply={setFiltros} />

      <Dialog open={customOpen} onOpenChange={setCustomOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Período personalizado</DialogTitle>
            <DialogDescription>Escolha a data inicial e final para o período do dashboard.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Data inicial</Label>
              <Input type="date" value={customRange.de} onChange={(e) => setCustomRange((r) => ({ ...r, de: e.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label>Data final</Label>
              <Input type="date" value={customRange.ate} onChange={(e) => setCustomRange((r) => ({ ...r, ate: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={aplicarPeriodoPersonalizado}>Aplicar período</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
