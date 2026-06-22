import { useMemo, useState } from 'react'
import { UserPlus, Handshake, Target, Coins, KanbanSquare, List, Contact, Filter, ChevronDown } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { FiltrosCrmDialog, DEFAULT_CRM_FILTROS, type CrmFiltros } from '@/features/crm/filtros-crm-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FunilKanban } from '@/features/crm/funil-kanban'
import { OportunidadesTab } from '@/features/crm/oportunidades-tab'
import { ClientesTab } from '@/features/crm/clientes-tab'
import { DEALS } from '@/features/crm/mock-data'
import { STAGE_MAP } from '@/features/crm/constants'
import type { Deal } from '@/features/crm/types'
import { formatBRL } from '@/lib/format'

const SPARKLINE_LEADS = [22, 25, 20, 28, 30, 26, 34, 31, 35, 38]
const SPARKLINE_NEG = [210, 240, 195, 280, 295, 260, 300, 290, 305, 312.4]
const SPARKLINE_TAXA = [28, 29, 27, 31, 30, 32, 29, 33, 32, 34]
const SPARKLINE_VALOR = [520, 560, 490, 580, 610, 595, 625, 640, 655, 668.1]

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 120; const h = 36
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x},${y}`
  })
  const areaPath = `M${pts.join('L')}L${w},${h}L0,${h}Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#sg-${color})`} />
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.8" />
      <circle cx={pts[pts.length - 1].split(',')[0]} cy={pts[pts.length - 1].split(',')[1]} r="2.5" fill={color} />
    </svg>
  )
}

function CrmStatCard({
  label, value, delta, deltaNote, icon: Icon, color, sparkData, ticketLabel, ticketValue,
}: {
  label: string; value: string; delta?: string; deltaNote?: string
  icon: React.ElementType; color: string; sparkData: number[]
  ticketLabel?: string; ticketValue?: string
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            {delta && (
              <p className="mt-1 text-xs text-[var(--status-success)] font-medium">
                ↑ {delta} <span className="text-muted-foreground font-normal">{deltaNote}</span>
              </p>
            )}
          </div>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${color}18` }}>
            <Icon className="size-5" style={{ color }} />
          </div>
        </div>
        <div className="mt-3">
          <MiniSparkline data={sparkData} color={color} />
        </div>
        {ticketLabel && ticketValue && (
          <p className="mt-2 text-xs text-muted-foreground">
            {ticketLabel} <span className="font-semibold text-foreground">{ticketValue}</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default function CrmPage() {
  const [filtrosOpen, setFiltrosOpen] = useState(false)
  const [filtros, setFiltros] = useState<CrmFiltros>(DEFAULT_CRM_FILTROS)
  const [deals, setDeals] = useState<Deal[]>(DEALS)

  const dealsFiltrados = useMemo(() => deals.filter((d) => {
    if (filtros.etapa !== 'Todas' && STAGE_MAP[d.etapa].label !== filtros.etapa) return false
    if (filtros.vendedor !== 'Todos' && d.vendedor !== filtros.vendedor) return false
    if (filtros.origem !== 'Todas' && d.origem !== filtros.origem) return false
    return true
  }), [deals, filtros])

  const stats = useMemo(() => {
    const abertos = dealsFiltrados.filter((d) => d.etapa !== 'fechado' && d.etapa !== 'perdido')
    const negociacao = dealsFiltrados.filter((d) => d.etapa === 'negociacao')
    const fechados = dealsFiltrados.filter((d) => d.etapa === 'fechado')
    const perdidos = dealsFiltrados.filter((d) => d.etapa === 'perdido')
    const totalDecididos = fechados.length + perdidos.length
    const valorNegociacao = negociacao.reduce((s, d) => s + d.valor, 0)
    const valorAndamento = abertos.reduce((s, d) => s + d.valor, 0)
    return {
      leadsAbertos: abertos.length,
      valorNegociacao,
      ticketNegociacao: negociacao.length ? Math.round(valorNegociacao / negociacao.length) : 0,
      taxaFechamento: totalDecididos ? Math.round((fechados.length / totalDecididos) * 100) : 0,
      valorAndamento,
      ticketAndamento: abertos.length ? Math.round(valorAndamento / abertos.length) : 0,
    }
  }, [dealsFiltrados])

  function handleDealsChange(updated: Deal[]) {
    setDeals((prev) => {
      const updatedMap = new Map(updated.map((d) => [d.id, d]))
      const merged = prev.map((d) => updatedMap.get(d.id) ?? d)
      const novos = updated.filter((d) => !prev.some((p) => p.id === d.id))
      return [...novos, ...merged]
    })
  }

  return (
    <div>
      <PageHeader
        breadcrumb="Comercial · CRM e Vendas"
        title="CRM e Vendas"
        description="Funil de oportunidades, clientes e negociações."
        actions={
          <Button variant="outline" onClick={() => setFiltrosOpen(true)}>
            <Filter className="size-4" />
            Filtros
            <ChevronDown className="size-4" />
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CrmStatCard
          label="Leads abertos"
          value={String(stats.leadsAbertos)}
          deltaNote="etapas: 1º contato, orçamento e negociação"
          icon={UserPlus}
          color="#6366F1"
          sparkData={SPARKLINE_LEADS}
        />
        <CrmStatCard
          label="Em negociação"
          value={formatBRL(stats.valorNegociacao)}
          deltaNote="soma das oportunidades na etapa"
          icon={Handshake}
          color="#8B5CF6"
          sparkData={SPARKLINE_NEG}
          ticketLabel="Ticket médio"
          ticketValue={formatBRL(stats.ticketNegociacao)}
        />
        <CrmStatCard
          label="Taxa de fechamento"
          value={`${stats.taxaFechamento}%`}
          deltaNote="fechados ÷ (fechados + perdidos)"
          icon={Target}
          color="#10B981"
          sparkData={SPARKLINE_TAXA}
        />
        <CrmStatCard
          label="Valor total em andamento"
          value={formatBRL(stats.valorAndamento)}
          deltaNote="oportunidades ainda não decididas"
          icon={Coins}
          color="#F59E0B"
          sparkData={SPARKLINE_VALOR}
          ticketLabel="Ticket médio"
          ticketValue={formatBRL(stats.ticketAndamento)}
        />
      </div>

      <Tabs defaultValue="funil" className="mt-6">
        <TabsList>
          <TabsTrigger value="funil">
            <KanbanSquare className="size-4" />
            Funil
          </TabsTrigger>
          <TabsTrigger value="oportunidades">
            <List className="size-4" />
            Oportunidades
          </TabsTrigger>
          <TabsTrigger value="clientes">
            <Contact className="size-4" />
            Clientes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="funil" className="mt-6">
          <FunilKanban deals={dealsFiltrados} onDealsChange={handleDealsChange} />
        </TabsContent>
        <TabsContent value="oportunidades" className="mt-6">
          <OportunidadesTab deals={dealsFiltrados} />
        </TabsContent>
        <TabsContent value="clientes" className="mt-6">
          <ClientesTab />
        </TabsContent>
      </Tabs>

      <FiltrosCrmDialog open={filtrosOpen} onOpenChange={setFiltrosOpen} value={filtros} onApply={setFiltros} />
    </div>
  )
}
