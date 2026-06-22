import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText, FileInput, ShieldCheck, FileCheck2, XCircle, Coins,
  Plus, Upload, FilePen, Ban, Hash, FileWarning, BarChart3, Settings2,
  ShieldAlert, Wifi, Zap, BookOpen, ArrowRight, ChevronDown,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { FiscalProvider, useFiscal } from '@/features/fiscal/fiscal-context'
import { NotasTab } from '@/features/fiscal/notas-tab'
import { EntradasTab } from '@/features/fiscal/entradas-tab'
import { CertificadoTab } from '@/features/fiscal/certificado-tab'
import { NotaDetailSheet } from '@/features/fiscal/nota-detail-sheet'
import type { NotaFiscal } from '@/features/fiscal/types'
import { formatBRL, formatDate } from '@/lib/format'

const ACOES_RAPIDAS = [
  { icon: Plus, label: 'Nova nota', color: 'text-primary' },
  { icon: Upload, label: 'Importar XML', color: 'text-emerald-600' },
  { icon: FilePen, label: 'Carta de correção', color: 'text-amber-600' },
  { icon: Ban, label: 'Cancelar nota', color: 'text-red-500' },
  { icon: Hash, label: 'Inutilizar numeração', color: 'text-slate-500' },
  { icon: FileWarning, label: 'Manifestação NFe', color: 'text-violet-600' },
  { icon: BarChart3, label: 'Relatórios', color: 'text-sky-600' },
  { icon: Settings2, label: 'Configurações', color: 'text-slate-500' },
]

const SITUACAO_FISCAL = [
  { icon: ShieldAlert, label: 'Certificado digital', sub: 'Válido até 12/03/2027', status: 'Válido', tone: 'success' as const },
  { icon: Wifi, label: 'Ambiente SEFAZ', sub: 'Produção', status: 'Conectado', tone: 'success' as const },
  { icon: Zap, label: 'Sefaz autorizadora', sub: 'Última autorização há 2 min', status: 'Operacional', tone: 'success' as const },
  { icon: BookOpen, label: 'Reforma tributária (IBS/CBS)', sub: 'Alíquotas e regras atualizadas', status: 'Ver detalhes', tone: 'info' as const },
]

const IMPOSTOS = [
  { label: 'ICMS a recolher', valor: 4210, status: 'Pago', tone: 'success' as const },
  { label: 'PIS a recolher', valor: 1120, status: 'A vencer', tone: 'warning' as const },
  { label: 'COFINS a recolher', valor: 2340, status: 'A vencer', tone: 'warning' as const },
  { label: 'ISS a recolher', valor: 980, status: 'Pago', tone: 'success' as const },
]

const IMPORTACOES_XML = [
  { data: '17/06/2026', hora: '14:32', tone: 'success' as const, status: 'Concluído', notas: 24 },
  { data: '17/06/2026', hora: '09:15', tone: 'success' as const, status: 'Concluído', notas: 18 },
  { data: '16/06/2026', hora: '17:48', tone: 'success' as const, status: 'Concluído', notas: 32 },
  { data: '16/06/2026', hora: '08:55', tone: 'warning' as const, status: 'Com erros', notas: 3 },
]

function FiscalContent() {
  const { notas, entradas } = useFiscal()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('notas')
  const [detail, setDetail] = useState<NotaFiscal | null>(null)

  const notasRejeitadas = useMemo(() => notas.filter((n) => n.status === 'rejeitada'), [notas])

  const stats = useMemo(() => {
    const autorizadas = notas.filter((n) => n.status === 'autorizada').length
    const rejeitadas = notas.filter((n) => n.status === 'rejeitada').length
    const credito = entradas.reduce((s, e) => s + (e.escriturada ? e.credito : 0), 0)
    const emitidas = notas.length
    const escrituradas = entradas.filter((e) => e.escriturada).length
    return { autorizadas, rejeitadas, credito, emitidas, escrituradas }
  }, [notas, entradas])

  const totalImpostos = IMPOSTOS.reduce((s, i) => s + i.valor, 0)

  return (
    <div>
      <PageHeader
        breadcrumb="Financeiro · Fiscal e Contábil"
        title="Fiscal e Contábil"
        description="Emissão de notas, escrituração de entradas e Reforma Tributária (IBS/CBS)."
        actions={
          <>
            <Button variant="outline" onClick={() => setActiveTab('entradas')}>
              <Upload className="size-4" />
              Importar XML
            </Button>
            <Button onClick={() => setActiveTab('notas')}>
              <Plus className="size-4" />
              Nova nota
              <ChevronDown className="size-4" />
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-5">
        <StatCard
          label="Notas autorizadas"
          value={String(stats.autorizadas)}
          icon={FileCheck2}
          tone="success"
          delta="+100%"
          deltaNote="vs mês anterior"
        />
        <StatCard
          label="Notas rejeitadas"
          value={String(stats.rejeitadas)}
          icon={XCircle}
          tone="danger"
          delta="-25%"
          deltaNote="vs mês anterior"
          deltaDirection="down"
        />
        <StatCard
          label="Crédito tributário (mês)"
          value={formatBRL(stats.credito || 7614)}
          icon={Coins}
          tone="success"
          delta="+18%"
          deltaNote="vs mês anterior"
        />
        <StatCard
          label="Notas emitidas (mês)"
          value={String(stats.emitidas || 24)}
          icon={FileText}
          delta="+14%"
          deltaNote="vs mês anterior"
        />
        <StatCard
          label="Entradas escrituradas (mês)"
          value={String(stats.escrituradas || 32)}
          icon={FileInput}
          delta="+20%"
          deltaNote="vs mês anterior"
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
                  if (label === 'Nova nota') setActiveTab('notas')
                  else if (label === 'Importar XML') setActiveTab('entradas')
                  else if (label === 'Relatórios') navigate('/bi')
                  else if (label === 'Carta de correção') setActiveTab('notas')
                  else if (label === 'Cancelar nota') setActiveTab('notas')
                  else if (label === 'Inutilizar numeração') setActiveTab('certificado')
                  else if (label === 'Manifestação NFe') setActiveTab('entradas')
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

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <span className="font-semibold">Situação fiscal</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => navigate('/bi')}>
              Ver relatório completo <ArrowRight className="size-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {SITUACAO_FISCAL.map(({ icon: Icon, label, sub, status, tone }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
                <StatusBadge tone={tone}>{status}</StatusBadge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <span className="font-semibold">Guia de impostos (mês)</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {IMPOSTOS.map(({ label, valor, status, tone }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium tabular-nums">{formatBRL(valor)}</span>
                    <StatusBadge tone={tone}>{status}</StatusBadge>
                  </div>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2 text-sm font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{formatBRL(totalImpostos)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_300px]">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="notas">
              <FileText className="size-4" />
              Notas emitidas
            </TabsTrigger>
            <TabsTrigger value="entradas">
              <FileInput className="size-4" />
              Entradas
            </TabsTrigger>
            <TabsTrigger value="certificado">
              <ShieldCheck className="size-4" />
              Certificado & SEFAZ
            </TabsTrigger>
          </TabsList>
          <TabsContent value="notas" className="mt-4">
            <NotasTab />
          </TabsContent>
          <TabsContent value="entradas" className="mt-4">
            <EntradasTab />
          </TabsContent>
          <TabsContent value="certificado" className="mt-4">
            <CertificadoTab />
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <span className="text-sm font-semibold">Notas rejeitadas (mês)</span>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('notas')}>
                Ver todas <ArrowRight className="size-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {notasRejeitadas.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma nota rejeitada este mês.</p>
              ) : notasRejeitadas.map((n) => (
                <div key={n.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{n.numero}</span>
                    <div className="flex items-center gap-2">
                      <StatusBadge tone="danger">Rejeitada</StatusBadge>
                      <span className="text-xs text-muted-foreground">{formatDate(n.emitidaEm)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{n.cliente} · {n.ambiente}</p>
                  <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => setDetail(n)}>
                    Corrigir
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <span className="text-sm font-semibold">Últimas importações XML</span>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary" onClick={() => setActiveTab('entradas')}>
                Ver todas <ArrowRight className="size-3 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {IMPORTACOES_XML.map((imp, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{imp.data}</span>
                    <span className="text-muted-foreground">{imp.hora}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge tone={imp.tone}>{imp.status}</StatusBadge>
                    <span className="text-xs text-muted-foreground">{imp.notas} notas</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <NotaDetailSheet nota={detail} onOpenChange={(o) => !o && setDetail(null)} />
    </div>
  )
}

export default function FiscalPage() {
  return (
    <FiscalProvider>
      <FiscalContent />
    </FiscalProvider>
  )
}
