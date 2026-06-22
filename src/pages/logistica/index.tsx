import { useMemo, useState } from 'react'
import {
  Truck, ClipboardList, Users, PackageCheck, AlertTriangle, Plus,
  CalendarPlus, Wrench, ClipboardCheck, ShieldAlert, Printer,
  ArrowRight, ChevronDown,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { NameAvatar } from '@/components/ui/name-avatar'
import { toast } from 'sonner'
import { LogisticaProvider, useLogistica } from '@/features/logistica/logistica-context'
import { NovaOsDialog } from '@/features/logistica/nova-os-dialog'
import { OrdensTab } from '@/features/logistica/ordens-tab'
import { EquipesTab } from '@/features/logistica/equipes-tab'
import { OsDetailSheet } from '@/features/logistica/os-detail-sheet'
import { OS_STATUS_META } from '@/features/logistica/constants'
import { EQUIPES_INFO } from '@/features/logistica/mock-data'
import { formatDateTime } from '@/lib/format'

const ACOES_RAPIDAS = [
  { icon: Plus, label: 'Nova OS', color: 'text-primary' },
  { icon: CalendarPlus, label: 'Agendar entrega', color: 'text-emerald-600' },
  { icon: Wrench, label: 'Ordem de montagem', color: 'text-amber-600' },
  { icon: ClipboardCheck, label: 'Check-list entrega', color: 'text-sky-600' },
  { icon: ShieldAlert, label: 'Registrar avaria', color: 'text-red-500' },
  { icon: Printer, label: 'Imprimir etiquetas', color: 'text-slate-500' },
]

function getProgressColor(pct: number) {
  if (pct >= 70) return 'bg-emerald-500'
  if (pct >= 40) return 'bg-amber-500'
  return 'bg-red-400'
}

function LogisticaContent() {
  const { ordens } = useLogistica()
  const [novaOsOpen, setNovaOsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('ordens')
  const [detail, setDetail] = useState<typeof ordens[number] | null>(null)

  const stats = useMemo(() => {
    const ativas = ordens.filter((o) => o.status !== 'concluida').length
    const concluidas = ordens.filter((o) => o.status === 'concluida').length
    const avarias = ordens.reduce((s, o) => s + o.avarias.length, 0)
    const hoje = ordens.filter((o) => o.status === 'em-rota').length
    return { ativas, concluidas, avarias, hoje }
  }, [ordens])

  const atrasadas = useMemo(
    () => ordens.filter((o) => o.status !== 'concluida' && new Date(o.agenda) < new Date()),
    [ordens],
  )
  const emMontagem = useMemo(() => ordens.filter((o) => o.status === 'em-montagem'), [ordens])
  const comAvaria = useMemo(() => ordens.filter((o) => o.avarias.length > 0), [ordens])

  const alertas = useMemo(() => {
    const lista: { label: string; sub: string; tone: 'danger' | 'warning' }[] = []
    if (atrasadas.length > 0) {
      lista.push({ label: `${atrasadas.length} entrega(s) atrasada(s)`, sub: atrasadas.map((o) => o.codigo).join(', '), tone: 'danger' })
    }
    if (emMontagem.length > 0) {
      lista.push({ label: `${emMontagem.length} OS em montagem`, sub: emMontagem.map((o) => o.codigo).join(', '), tone: 'warning' })
    }
    if (comAvaria.length > 0) {
      lista.push({ label: `${comAvaria.length} OS com avaria pendente`, sub: comAvaria.map((o) => o.codigo).join(', '), tone: 'warning' })
    }
    return lista
  }, [atrasadas, emMontagem, comAvaria])

  const equipesCapacidade = useMemo(
    () => EQUIPES_INFO.map((eq) => {
      const daEquipe = ordens.filter((o) => o.equipe === eq.nome)
      const ativas = daEquipe.filter((o) => o.status !== 'concluida').length
      const total = daEquipe.length || 1
      return { nome: eq.nome, ativas, total: daEquipe.length, pct: Math.round((ativas / total) * 100) }
    }),
    [ordens],
  )

  const proximasEntregas = useMemo(
    () => ordens
      .filter((o) => o.status === 'agendada' || o.status === 'em-rota')
      .sort((a, b) => a.agenda.localeCompare(b.agenda))
      .slice(0, 3),
    [ordens],
  )

  const avariasRecentes = useMemo(
    () => ordens.flatMap((o) => o.avarias.map((a) => ({ ...a, os: o }))),
    [ordens],
  )

  function abrirOsRelevante(filtro: (o: typeof ordens[number]) => boolean) {
    const alvo = ordens.find(filtro)
    if (alvo) setDetail(alvo)
    else toast.info('Nenhuma OS encontrada para essa ação.')
  }

  function imprimirEtiquetas() {
    const linhas = ordens
      .filter((o) => o.status !== 'concluida')
      .map((o) => `${o.codigo} | ${o.cliente} | ${o.ambiente} | ${o.equipe}`)
    if (linhas.length === 0) {
      toast.info('Nenhuma OS ativa para gerar etiquetas.')
      return
    }
    const blob = new Blob([linhas.join('\n')], { type: 'text/plain;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'etiquetas-os.txt'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Etiquetas geradas para impressão.')
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Operações · Logística e Montagem"
        title="Logística e Montagem"
        description="Agenda de entregas, ordens de montagem, avarias e equipes."
        actions={
          <Button onClick={() => setNovaOsOpen(true)}>
            <Plus className="size-4" />
            Nova OS
            <ChevronDown className="size-4" />
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="OS ativas" value={String(stats.ativas)} icon={Truck} delta="+50%" deltaNote="vs mês anterior" />
        <StatCard label="Concluídas (mês)" value={String(stats.concluidas)} icon={PackageCheck} tone="success" delta="+20%" deltaNote="vs mês anterior" />
        <StatCard label="Avarias registradas" value={String(stats.avarias)} icon={AlertTriangle} tone="danger" delta="-33%" deltaNote="vs mês anterior" deltaDirection="down" />
        <StatCard
          label="Em rota"
          value={String(stats.hoje)}
          icon={Truck}
          deltaNote={`${proximasEntregas.length} entrega(s) agendada(s) em breve`}
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
                  if (label === 'Nova OS') setNovaOsOpen(true)
                  else if (label === 'Agendar entrega') setNovaOsOpen(true)
                  else if (label === 'Ordem de montagem') abrirOsRelevante((o) => o.status === 'em-rota' || o.status === 'em-montagem')
                  else if (label === 'Check-list entrega') abrirOsRelevante((o) => o.status !== 'concluida')
                  else if (label === 'Registrar avaria') abrirOsRelevante((o) => o.status === 'em-montagem' || o.status === 'em-rota')
                  else if (label === 'Imprimir etiquetas') imprimirEtiquetas()
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
          <CardHeader className="flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Alertas e pendências</span>
              <span className="flex size-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">
                {alertas.length}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertas.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum alerta no momento.</p>
            ) : alertas.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <AlertTriangle className={`mt-0.5 size-4 shrink-0 ${a.tone === 'danger' ? 'text-red-500' : 'text-amber-500'}`} />
                <div>
                  <p className="text-sm font-medium">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.sub}</p>
                </div>
              </div>
            ))}
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('ordens')}>
              Ver todos os alertas <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <span className="font-semibold">Equipes e capacidade</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('equipes')}>
              Ver todas <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {equipesCapacidade.map((eq) => (
              <div key={eq.nome} className="flex items-center gap-3">
                <NameAvatar name={eq.nome} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{eq.nome}</span>
                    <span className="text-xs text-muted-foreground">{eq.ativas}/{eq.total}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${getProgressColor(eq.pct)}`}
                      style={{ width: `${eq.pct}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-medium tabular-nums">{eq.pct}%</span>
                <StatusBadge tone="success">Ativa</StatusBadge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="ordens">
              <ClipboardList className="size-4" />
              Ordens de Serviço
            </TabsTrigger>
            <TabsTrigger value="equipes">
              <Users className="size-4" />
              Equipes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ordens" className="mt-4">
            <OrdensTab />
          </TabsContent>
          <TabsContent value="equipes" className="mt-4">
            <EquipesTab />
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <span className="text-sm font-semibold">Próximas entregas</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('ordens')}>
              Ver todas <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {proximasEntregas.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma entrega agendada.</p>
            ) : proximasEntregas.map((o) => (
              <button key={o.codigo} className="flex w-full items-start justify-between gap-2 text-left text-sm hover:bg-accent/50 rounded-lg p-1.5 -m-1.5" onClick={() => setDetail(o)}>
                <div>
                  <p className="font-medium">{o.codigo} · {o.cliente}</p>
                  <p className="text-xs text-muted-foreground">{o.ambiente}</p>
                </div>
                <div className="text-right shrink-0">
                  <StatusBadge tone={OS_STATUS_META[o.status].tone}>{OS_STATUS_META[o.status].label}</StatusBadge>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(o.agenda)}</p>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <span className="text-sm font-semibold">Montagens em andamento</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('ordens')}>
              Ver todas <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {emMontagem.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma montagem em andamento.</p>
            ) : emMontagem.map((o) => (
              <button key={o.codigo} className="w-full text-left text-sm hover:bg-accent/50 rounded-lg p-1.5 -m-1.5" onClick={() => setDetail(o)}>
                <p className="font-medium">{o.codigo} · {o.cliente}</p>
                <p className="text-xs text-muted-foreground">{o.ambiente}</p>
                <p className="text-xs text-muted-foreground">{o.checkIn ? `Iniciado ${formatDateTime(o.checkIn)}` : 'Sem check-in'}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <span className="text-sm font-semibold">Avarias recentes</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('ordens')}>
              Ver todas <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {avariasRecentes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma avaria registrada.</p>
            ) : avariasRecentes.map((a, i) => (
              <button key={i} className="flex w-full items-start justify-between gap-2 text-left text-sm hover:bg-accent/50 rounded-lg p-1.5 -m-1.5" onClick={() => setDetail(a.os)}>
                <div>
                  <p className="font-medium">{a.os.codigo} · {a.peca}</p>
                  <p className="text-xs text-muted-foreground">{a.descricao}</p>
                </div>
                <StatusBadge tone="danger">Pendente</StatusBadge>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <NovaOsDialog open={novaOsOpen} onOpenChange={setNovaOsOpen} />
      <OsDetailSheet os={detail} onOpenChange={(o) => !o && setDetail(null)} />
    </div>
  )
}

export default function LogisticaPage() {
  return (
    <LogisticaProvider>
      <LogisticaContent />
    </LogisticaProvider>
  )
}
