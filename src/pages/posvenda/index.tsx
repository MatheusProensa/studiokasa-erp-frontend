import { useMemo, useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Headset, ShieldCheck, Smile, Wrench, Clock, Plus, ChevronDown,
  CalendarPlus, UserPlus, Package, ShieldAlert, DollarSign,
  ClipboardList, ArrowRight, Star,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { toast } from 'sonner'
import { PosvendaProvider, usePosvenda } from '@/features/posvenda/posvenda-context'
import { NovoChamadoDialog } from '@/features/posvenda/novo-chamado-dialog'
import { ChamadosTab } from '@/features/posvenda/chamados-tab'
import { GarantiasTab } from '@/features/posvenda/garantias-tab'
import { NpsTab } from '@/features/posvenda/nps-tab'
import { ChamadoDetailSheet } from '@/features/posvenda/chamado-detail-sheet'
import { CHAMADO_STATUS_META } from '@/features/posvenda/constants'
import { NPS, GARANTIAS } from '@/features/posvenda/mock-data'
import { formatDate, formatDateTime } from '@/lib/format'

const ACOES_RAPIDAS = [
  { icon: Headset, label: 'Novo chamado', color: 'text-primary' },
  { icon: CalendarPlus, label: 'Agendar visita', color: 'text-emerald-600' },
  { icon: UserPlus, label: 'Atribuir técnico', color: 'text-sky-600' },
  { icon: Package, label: 'Solicitar peça', color: 'text-amber-600' },
  { icon: ShieldAlert, label: 'Registrar garantia', color: 'text-violet-600' },
  { icon: DollarSign, label: 'Enviar orçamento', color: 'text-emerald-500' },
  { icon: Smile, label: 'Pesquisa NPS', color: 'text-sky-500' },
  { icon: ClipboardList, label: 'Relatórios', color: 'text-slate-500' },
]

function PrioridadeDonut({ alta, media, baixa }: { alta: number; media: number; baixa: number }) {
  const id = useId()
  const total = alta + media + baixa
  const r = 36
  const circ = 2 * Math.PI * r

  function arc(start: number, value: number) {
    const dash = (value / total) * circ
    return { dasharray: `${dash} ${circ}`, offset: start }
  }

  const altaArc = arc(0, alta)
  const mediaArc = arc(-((alta / total) * circ), media)
  const baixaArc = arc(-(((alta + media) / total) * circ), baixa)

  return (
    <svg viewBox="0 0 100 100" className="size-24">
      <defs>
        <style>{`#donut-${id} circle { transform-origin: 50px 50px; transform: rotate(-90deg); }`}</style>
      </defs>
      <g id={`donut-${id}`}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--status-danger)" strokeWidth="14"
          strokeDasharray={altaArc.dasharray} strokeDashoffset={altaArc.offset} />
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--primary)" strokeWidth="14"
          strokeDasharray={mediaArc.dasharray} strokeDashoffset={mediaArc.offset} />
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--status-success)" strokeWidth="14"
          strokeDasharray={baixaArc.dasharray} strokeDashoffset={baixaArc.offset} />
      </g>
      <text x="50" y="47" textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">{total}</text>
      <text x="50" y="59" textAnchor="middle" fontSize="8" fill="currentColor" opacity="0.6">Total</text>
    </svg>
  )
}

function NpsSparkline() {
  const data = [68, 70, 71, 69, 73, 72]
  const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
  const w = 260; const h = 80
  const padL = 20; const padB = 20; const padR = 10; const padT = 10
  const chartW = w - padL - padR; const chartH = h - padB - padT
  const min = 0; const max = 100

  const pts = data.map((v, i) => ({
    x: padL + (i / (data.length - 1)) * chartW,
    y: padT + chartH - ((v - min) / (max - min)) * chartH,
  }))

  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  const yLines = [0, 25, 50, 75, 100]

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 80 }}>
      {yLines.map((v) => {
        const y = padT + chartH - ((v - min) / (max - min)) * chartH
        return <line key={v} x1={padL} y1={y} x2={w - padR} y2={y} stroke="var(--border)" strokeWidth="1" />
      })}
      {labels.map((l, i) => (
        <text key={l} x={pts[i].x} y={h - 4} textAnchor="middle" fontSize="9" fill="var(--muted-foreground)">{l}</text>
      ))}
      <path d={line} fill="none" stroke="var(--status-success)" strokeWidth="2" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--status-success)" />
      ))}
      <text x={pts[pts.length - 1].x + 6} y={pts[pts.length - 1].y + 4} fontSize="10" fontWeight="700" fill="var(--status-success)">72</text>
    </svg>
  )
}

function PosvendaContent() {
  const { chamados } = usePosvenda()
  const navigate = useNavigate()
  const [chamadoOpen, setChamadoOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('chamados')
  const [detail, setDetail] = useState<typeof chamados[number] | null>(null)

  const stats = useMemo(() => {
    const abertos = chamados.filter((c) => c.status !== 'encerrado').length
    const pecas = chamados.filter((c) => c.status === 'peca-solicitada').length
    return { abertos, pecas }
  }, [chamados])

  const alta = chamados.filter((c) => c.prioridade === 'alta').length
  const media = chamados.filter((c) => c.prioridade === 'media').length
  const baixa = chamados.filter((c) => c.prioridade === 'baixa').length

  const chamadosPorStatus = useMemo(() => {
    const grupos: Record<string, number> = {}
    for (const c of chamados) grupos[c.status] = (grupos[c.status] ?? 0) + 1
    return Object.entries(grupos).map(([status, count]) => ({
      label: CHAMADO_STATUS_META[status as keyof typeof CHAMADO_STATUS_META].label,
      tone: CHAMADO_STATUS_META[status as keyof typeof CHAMADO_STATUS_META].tone,
      count,
    }))
  }, [chamados])

  const chamadosPorTecnico = useMemo(() => {
    const grupos: Record<string, number> = {}
    for (const c of chamados) grupos[c.tecnico] = (grupos[c.tecnico] ?? 0) + 1
    const max = Math.max(...Object.values(grupos), 1)
    return Object.entries(grupos).map(([tecnico, count]) => ({ tecnico, count, pct: Math.round((count / max) * 100) }))
  }, [chamados])

  const garantiasVigentes = useMemo(
    () => GARANTIAS.filter((g) => new Date(g.fim) > new Date()).slice(0, 3),
    [],
  )

  const emAtendimento = useMemo(
    () => chamados.filter((c) => c.status === 'atendimento'),
    [chamados],
  )

  function abrirChamadoRelevante(filtro: (c: typeof chamados[number]) => boolean) {
    const alvo = chamados.find(filtro)
    if (alvo) setDetail(alvo)
    else toast.info('Nenhum chamado encontrado para essa ação.')
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Suporte · Pós-venda"
        title="Pós-venda e Assistência"
        description="Chamados de assistência, garantias e satisfação (NPS)."
        actions={
          <Button onClick={() => setChamadoOpen(true)}>
            <Plus className="size-4" />
            Novo chamado
            <ChevronDown className="size-4" />
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Chamados abertos" value={String(stats.abertos)} icon={Wrench} delta="+25%" deltaNote="vs mês anterior" />
        <StatCard label="Aguardando peça" value={String(stats.pecas)} icon={Clock} tone="danger" delta="-20%" deltaNote="vs mês anterior" deltaDirection="down" />
        <StatCard label="NPS (mês atual)" value={String(NPS.score)} icon={Smile} tone="success" delta="+8 pts" deltaNote="vs mês anterior" />
        <StatCard label="SLA no prazo" value="94%" icon={ShieldCheck} tone="success" delta="+6%" deltaNote="vs mês anterior" />
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
                  if (label === 'Novo chamado') setChamadoOpen(true)
                  else if (label === 'Agendar visita') setChamadoOpen(true)
                  else if (label === 'Atribuir técnico') abrirChamadoRelevante((c) => c.status === 'aberto')
                  else if (label === 'Solicitar peça') abrirChamadoRelevante((c) => c.status === 'atendimento')
                  else if (label === 'Registrar garantia') setActiveTab('garantias')
                  else if (label === 'Enviar orçamento') navigate('/crm')
                  else if (label === 'Relatórios') navigate('/bi')
                  else if (label === 'Pesquisa NPS') toast.success('Pesquisa NPS disparada por e-mail.')
                }}
              >
                <Icon className={`size-4 ${color}`} />
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <span className="font-semibold">Resumo por prioridade</span>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <PrioridadeDonut alta={alta || 1} media={media || 3} baixa={baixa || 1} />
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[var(--status-danger)]" />
                <span className="text-muted-foreground">Alta</span>
                <span className="ml-auto font-semibold">{alta || 1} (20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">Média</span>
                <span className="ml-auto font-semibold">{media || 3} (60%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[var(--status-success)]" />
                <span className="text-muted-foreground">Baixa</span>
                <span className="ml-auto font-semibold">{baixa || 1} (20%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <span className="font-semibold">NPS (últimos 6 meses)</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => navigate('/bi')}>
              Ver relatório completo <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <NpsSparkline />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>100</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_260px]">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="chamados">
              <Headset className="size-4" />
              Chamados
            </TabsTrigger>
            <TabsTrigger value="garantias">
              <ShieldCheck className="size-4" />
              Garantias
            </TabsTrigger>
            <TabsTrigger value="nps">
              <Smile className="size-4" />
              NPS
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chamados" className="mt-4">
            <ChamadosTab />
          </TabsContent>
          <TabsContent value="garantias" className="mt-4">
            <GarantiasTab />
          </TabsContent>
          <TabsContent value="nps" className="mt-4">
            <NpsTab />
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <span className="text-sm font-semibold">Chamados por status</span>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('chamados')}>
                Ver todas <ArrowRight className="size-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {chamadosPorStatus.map((s) => (
                <div key={s.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="size-2 rounded-full" style={{ backgroundColor: `var(--status-${s.tone})` }} />
                    {s.label}
                  </span>
                  <span className="font-semibold">{s.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <span className="text-sm font-semibold">Chamados por técnico</span>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('chamados')}>
                Ver todos <ArrowRight className="size-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {chamadosPorTecnico.map((t) => (
                <div key={t.tecnico} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{t.tecnico}</span>
                    <span className="font-semibold">{t.count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${t.pct}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <span className="text-sm font-semibold">Avaliações (NPS)</span>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('nps')}>
                Ver todas <ArrowRight className="size-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Promotores (9–10)</span>
                <span className="font-semibold">{NPS.promotores} ({Math.round((NPS.promotores / NPS.respostas) * 100)}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Neutros (7–8)</span>
                <span className="font-semibold">{NPS.neutros} ({Math.round((NPS.neutros / NPS.respostas) * 100)}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Detratores (0–6)</span>
                <span className="font-semibold">{NPS.detratores} ({Math.round((NPS.detratores / NPS.respostas) * 100)}%)</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>NPS atual</span>
                <span className="text-[var(--status-success)]">{NPS.score}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <span className="text-sm font-semibold">Satisfação do cliente (média)</span>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('nps')}>
                Ver todas <ArrowRight className="size-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">4,6</span>
                <span className="text-sm text-muted-foreground">/ 5</span>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4].map((i) => <Star key={i} className="size-4 fill-current" />)}
                  <Star className="size-4 fill-current opacity-40" />
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Baseado em 40 avaliações</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <span className="font-semibold">Garantias ativas</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('garantias')}>
              Ver todas <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {garantiasVigentes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma garantia vigente.</p>
            ) : garantiasVigentes.map((g) => (
              <div key={g.projeto} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{g.ambiente} — {g.cliente}</p>
                  <p className="text-xs text-muted-foreground">Válida até {formatDate(g.fim)}</p>
                </div>
                <StatusBadge tone="success">Ativa</StatusBadge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <span className="font-semibold">Chamados em atendimento</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('chamados')}>
              Ver todas <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {emAtendimento.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum chamado em atendimento.</p>
            ) : emAtendimento.map((c) => (
              <button key={c.codigo} className="flex w-full items-center justify-between gap-2 text-left text-sm hover:bg-accent/50 rounded-lg p-1.5 -m-1.5" onClick={() => setDetail(c)}>
                <div>
                  <p className="font-medium">{c.codigo} · {c.cliente}</p>
                  <p className="text-xs text-muted-foreground">{c.tecnico} · {formatDateTime(c.abertoEm)}</p>
                </div>
                <StatusBadge tone="info">Em atendimento</StatusBadge>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <NovoChamadoDialog open={chamadoOpen} onOpenChange={setChamadoOpen} />
      <ChamadoDetailSheet chamado={detail} onOpenChange={(o) => !o && setDetail(null)} />
    </div>
  )
}

export default function PosvendaPage() {
  return (
    <PosvendaProvider>
      <PosvendaContent />
    </PosvendaProvider>
  )
}
