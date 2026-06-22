import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Megaphone, Users, Coins, Target, Plus, Download, ChevronDown, TrendingUp,
  UserPlus, Settings2, BarChart2,
} from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/page-header'
import { NovaCampanhaDialog } from '@/features/marketing/nova-campanha-dialog'
import { StatCard } from '@/components/patterns/stat-card'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { CampanhasTab } from '@/features/marketing/campanhas-tab'
import { LeadsTab } from '@/features/marketing/leads-tab'
import { CAMPANHAS, LEADS_MKT } from '@/features/marketing/mock-data'
import { formatBRL } from '@/lib/format'

const ACOES_RAPIDAS = [
  { icon: Plus, label: 'Nova campanha', color: 'text-primary' },
  { icon: UserPlus, label: 'Novo lead', color: 'text-sky-600' },
  { icon: Download, label: 'Exportar relatório', color: 'text-amber-600' },
  { icon: BarChart2, label: 'Relatório completo', color: 'text-violet-600' },
  { icon: Settings2, label: 'Configurações', color: 'text-slate-500' },
]

const CORES_CANAL: Record<string, string> = {
  Google: '#4285F4', Instagram: '#E1306C', 'Meta Ads': '#1877F2', 'E-mail': '#06B6D4',
}
const CORES_ESTAGIO: Record<string, string> = {
  novo: '#6366F1', qualificado: '#8B5CF6', enviado: '#34D399',
}
const LABEL_ESTAGIO: Record<string, string> = {
  novo: 'Novos leads', qualificado: 'Qualificados', enviado: 'Enviados ao CRM',
}

const INSIGHTS = [
  { cor: 'text-emerald-600', bg: 'bg-emerald-50', titulo: 'Aumento de 25% em leads captados', sub: 'Comparado ao período anterior.' },
  { cor: 'text-sky-600', bg: 'bg-sky-50', titulo: 'CAC médio reduziu 12%', sub: 'Melhora de eficiência nas campanhas.' },
  { cor: 'text-amber-600', bg: 'bg-amber-50', titulo: 'Google Search com melhor ROI', sub: 'Maior volume de leads qualificados.' },
]

function CanaisDonut({ dados }: { dados: { canal: string; pct: number; cor: string }[] }) {
  const r = 38; const cx = 50; const cy = 50
  const circ = 2 * Math.PI * r
  let offset = 0

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" className="size-24 shrink-0">
        {dados.map(({ pct, cor }) => {
          const dash = (pct / 100) * circ
          const el = (
            <circle
              key={cor}
              cx={cx} cy={cy} r={r}
              fill="none" stroke={cor} strokeWidth="14"
              strokeDasharray={`${dash} ${circ}`}
              strokeDashoffset={-offset}
              style={{ transformOrigin: `${cx}px ${cy}px`, transform: 'rotate(-90deg)' }}
            />
          )
          offset += dash
          return el
        })}
      </svg>
      <div className="space-y-1.5">
        {dados.map(({ canal, pct, cor }) => (
          <div key={canal} className="flex items-center gap-2 text-sm">
            <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: cor }} />
            <span className="text-muted-foreground">{canal}</span>
            <span className="ml-auto font-semibold">{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LeadsFunnel({ dados }: { dados: { label: string; pct: number; count: number; cor: string }[] }) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-1">
        {dados.map(({ label, pct, cor }) => {
          const w = Math.max(30, pct * 1.5)
          return (
            <div
              key={label}
              className="h-8 rounded-sm"
              style={{ width: `${w}px`, backgroundColor: cor }}
            />
          )
        })}
      </div>
      <div className="space-y-1.5">
        {dados.map(({ label, pct, count, cor }) => (
          <div key={label} className="flex items-center gap-2 text-sm">
            <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: cor }} />
            <span className="text-muted-foreground">{label}</span>
            <span className="ml-auto font-semibold">{pct}% ({count})</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function exportarCsv() {
  const header = ['Campanha', 'Tipo', 'Canal', 'Responsável', 'Status', 'Investimento', 'Leads', 'Conversão (%)']
  const linhas = CAMPANHAS.map((c) => {
    const leads = LEADS_MKT.filter((l) => l.campanhaId === c.id)
    const enviados = leads.filter((l) => l.status === 'enviado').length
    const conversao = leads.length > 0 ? Math.round((enviados / leads.length) * 100) : 0
    return [c.nome, c.tipo, c.canal, c.responsavel, c.status, c.investimento, leads.length, conversao]
  })
  const csv = [header, ...linhas].map((l) => l.join(';')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'relatorio-marketing.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function MarketingPage() {
  const navigate = useNavigate()
  const [campOpen, setCampOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('campanhas')
  const investimento = CAMPANHAS.reduce((s, c) => s + c.investimento, 0)
  const leadsTotal = LEADS_MKT.length
  const cac = leadsTotal > 0 ? investimento / leadsTotal : 0

  const canaisPerf = useMemo(() => {
    const totais: Record<string, number> = {}
    for (const l of LEADS_MKT) totais[l.origem] = (totais[l.origem] ?? 0) + 1
    const total = LEADS_MKT.length || 1
    return Object.entries(totais).map(([canal, leads]) => ({
      canal, pct: Math.round((leads / total) * 100), cor: CORES_CANAL[canal] ?? '#94A3B8',
    }))
  }, [])

  const leadsEstagios = useMemo(() => {
    const totais: Record<string, number> = {}
    for (const l of LEADS_MKT) totais[l.status] = (totais[l.status] ?? 0) + 1
    const total = LEADS_MKT.length || 1
    return Object.entries(totais).map(([status, count]) => ({
      label: LABEL_ESTAGIO[status] ?? status, count, pct: Math.round((count / total) * 100), cor: CORES_ESTAGIO[status] ?? '#94A3B8',
    }))
  }, [])

  return (
    <div>
      <PageHeader
        breadcrumb="Comercial · Marketing"
        title="Marketing"
        description="Campanhas, captação de leads e CAC."
        actions={
          <>
            <Button variant="outline" onClick={() => { exportarCsv(); toast.success('Relatório exportado.') }}>
              <Download className="size-4" />
              Exportar relatório
            </Button>
            <Button onClick={() => setCampOpen(true)}>
              <Plus className="size-4" />
              Nova campanha
              <ChevronDown className="size-4" />
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Investimento"
          value={formatBRL(investimento)}
          icon={Coins}
          delta="+18%"
          deltaNote="vs. período anterior"
        />
        <StatCard
          label="Leads captados"
          value={String(LEADS_MKT.length)}
          icon={Users}
          delta="+25%"
          deltaNote="vs. período anterior"
        />
        <StatCard
          label="CAC médio"
          value={formatBRL(cac)}
          icon={Target}
          tone="success"
          delta="+12%"
          deltaNote="vs. período anterior"
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
                  if (label === 'Nova campanha') setCampOpen(true)
                  else if (label === 'Novo lead') setActiveTab('leads')
                  else if (label === 'Exportar relatório') { exportarCsv(); toast.success('Relatório exportado.') }
                  else if (label === 'Relatório completo') navigate('/bi')
                  else if (label === 'Configurações') navigate('/adm')
                }}
              >
                <Icon className={`size-4 ${color}`} />
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList>
          <TabsTrigger value="campanhas">
            <Megaphone className="size-4" />
            Campanhas
          </TabsTrigger>
          <TabsTrigger value="leads">
            <Users className="size-4" />
            Leads
          </TabsTrigger>
        </TabsList>
        <TabsContent value="campanhas" className="mt-4">
          <CampanhasTab />
        </TabsContent>
        <TabsContent value="leads" className="mt-4">
          <LeadsTab />
        </TabsContent>
      </Tabs>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <span className="font-semibold">Canais de performance</span>
          </CardHeader>
          <CardContent>
            <CanaisDonut dados={canaisPerf} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <span className="font-semibold">Leads por estágio</span>
          </CardHeader>
          <CardContent>
            <LeadsFunnel dados={leadsEstagios} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Insights do período</span>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => navigate('/bi')}>
                Ver relatório completo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {INSIGHTS.map((ins) => (
              <div key={ins.titulo} className="flex items-start gap-3">
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${ins.bg}`}>
                  <TrendingUp className={`size-4 ${ins.cor}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{ins.titulo}</p>
                  <p className="text-xs text-muted-foreground">{ins.sub}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <NovaCampanhaDialog open={campOpen} onOpenChange={setCampOpen} />
    </div>
  )
}
