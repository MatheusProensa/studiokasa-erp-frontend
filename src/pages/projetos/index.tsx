import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  FolderKanban, KanbanSquare, List, CircleCheck, Clock, X, Plus, Download,
  ChevronDown, Copy, BadgeCheck, CalendarPlus, FileDown, BarChart3, Settings2,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/patterns/stat-card'
import { toast } from 'sonner'
import { ProjetosProvider, useProjetos } from '@/features/projetos/projetos-context'
import { ProjetosKanban } from '@/features/projetos/projetos-kanban'
import { ProjetosTable } from '@/features/projetos/projetos-table'
import { ProjetoFormDialog } from '@/features/projetos/projeto-form-dialog'
import { ProjetoDetailSheet } from '@/features/projetos/projeto-detail-sheet'
import { ETAPAS } from '@/features/projetos/constants'
import { formatBRL } from '@/lib/format'
import { cn } from '@/lib/utils'

const ACOES_RAPIDAS = [
  { icon: FolderKanban, label: 'Novo projeto', color: 'text-primary' },
  { icon: Copy, label: 'Duplicar projeto', color: 'text-sky-600' },
  { icon: BadgeCheck, label: 'Aprovar pendente', color: 'text-amber-600' },
  { icon: CalendarPlus, label: 'Agendar tarefa', color: 'text-emerald-600' },
  { icon: FileDown, label: 'Importar dados', color: 'text-violet-600' },
  { icon: BarChart3, label: 'Relatórios de projetos', color: 'text-slate-500' },
  { icon: Settings2, label: 'Configurações', color: 'text-slate-500' },
]

function ProjetosKpis({ onVerPendentes }: { onVerPendentes: () => void }) {
  const { projetos, setStatusFiltro } = useProjetos()
  const stats = useMemo(() => {
    const ativos = projetos.filter((p) => p.etapa !== 'montagem').length
    const aguardando = projetos.filter((p) => !p.aprovado).length
    const emProducao = projetos.filter((p) => p.etapa === 'producao').length
    return { ativos, aguardando, emProducao }
  }, [projetos])

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Projetos ativos" value={String(stats.ativos)} icon={FolderKanban} delta="+1" deltaNote="vs. mês anterior" />
      <StatCard label="Em produção" value={String(stats.emProducao)} icon={CircleCheck} tone="success" delta="+1" deltaNote="vs. mês anterior" />
      <button onClick={() => { setStatusFiltro('pendente'); onVerPendentes() }} className="text-left">
        <StatCard label="Aguardando aprovação" value={String(stats.aguardando)} icon={Clock} delta="+1" deltaNote="vs. mês anterior" className="cursor-pointer transition-colors hover:bg-accent/50" />
      </button>
    </div>
  )
}

const TONE_COLOR: Record<string, string> = {
  neutral: 'var(--status-neutral)',
  info: 'var(--status-info)',
  warning: 'var(--status-warning)',
  success: 'var(--status-success)',
  danger: 'var(--status-danger)',
}

function FiltroPill({
  ativo,
  cor,
  label,
  count,
  total,
  onClick,
}: {
  ativo: boolean
  cor: string
  label: string
  count: number
  total?: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors',
        ativo ? 'border-primary bg-accent font-semibold' : 'hover:bg-accent/60',
      )}
    >
      <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: cor }} />
      {label}
      <Badge variant="secondary" className="px-1.5 tabular-nums">{count}</Badge>
      {total !== undefined && <span className="text-xs text-muted-foreground tabular-nums">{formatBRL(total)}</span>}
    </button>
  )
}

/** Barra didática de filtros: status de aprovação + etapa, com contagem e valor por categoria. */
function ProjetosFiltros() {
  const { projetos, statusFiltro, setStatusFiltro, etapaFiltro, setEtapaFiltro } = useProjetos()

  const porEtapa = useMemo(
    () =>
      ETAPAS.map((e) => {
        const lista = projetos.filter((p) => p.etapa === e.key)
        return { ...e, count: lista.length, total: lista.reduce((s, p) => s + p.valor, 0) }
      }),
    [projetos],
  )
  const pendentes = projetos.filter((p) => !p.aprovado).length
  const aprovados = projetos.filter((p) => p.aprovado).length

  function clicarEtapa(key: typeof porEtapa[number]['key']) {
    setEtapaFiltro(etapaFiltro === key ? null : key)
  }

  return (
    <div className="mb-4 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium text-muted-foreground">Status:</span>
        <FiltroPill
          ativo={statusFiltro === 'todos'}
          cor="var(--status-neutral)"
          label="Todos"
          count={projetos.length}
          onClick={() => setStatusFiltro('todos')}
        />
        <FiltroPill
          ativo={statusFiltro === 'pendente'}
          cor="var(--status-warning)"
          label="Aguardando aprovação"
          count={pendentes}
          onClick={() => setStatusFiltro(statusFiltro === 'pendente' ? 'todos' : 'pendente')}
        />
        <FiltroPill
          ativo={statusFiltro === 'aprovado'}
          cor="var(--status-success)"
          label="Aprovados"
          count={aprovados}
          onClick={() => setStatusFiltro(statusFiltro === 'aprovado' ? 'todos' : 'aprovado')}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium text-muted-foreground">Etapa:</span>
        {porEtapa.map((e) => (
          <FiltroPill
            key={e.key}
            ativo={etapaFiltro === e.key}
            cor={TONE_COLOR[e.tone]}
            label={e.label}
            count={e.count}
            total={e.total}
            onClick={() => clicarEtapa(e.key)}
          />
        ))}
      </div>
    </div>
  )
}

function FiltroClienteChip() {
  const { filtroCliente, setFiltroCliente } = useProjetos()
  const [, setParams] = useSearchParams()
  if (!filtroCliente) return null
  return (
    <Badge variant="secondary" className="mb-4 gap-1.5 py-1 pl-3 pr-1.5">
      Cliente: {filtroCliente}
      <button
        aria-label="Limpar filtro"
        className="rounded-full p-0.5 hover:bg-background/60"
        onClick={() => { setFiltroCliente(null); setParams({}) }}
      >
        <X className="size-3.5" />
      </button>
    </Badge>
  )
}

function SyncFiltro() {
  const [params] = useSearchParams()
  const { setFiltroCliente } = useProjetos()
  const cliente = params.get('cliente')
  useEffect(() => { setFiltroCliente(cliente) }, [cliente, setFiltroCliente])
  return null
}

function exportarCsv(projetos: ReturnType<typeof useProjetos>['projetos']) {
  const header = ['Código', 'Cliente', 'Ambiente', 'Projetista', 'Etapa', 'Valor', 'Aprovado']
  const linhas = projetos.map((p) => [p.codigo, p.cliente, p.ambiente, p.projetista, p.etapa, p.valor, p.aprovado ? 'Sim' : 'Não'])
  const csv = [header, ...linhas].map((l) => l.join(';')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'relatorio-projetos.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function ProjetosContent() {
  const [novoOpen, setNovoOpen] = useState(false)
  const [pendenteDetail, setPendenteDetail] = useState<ReturnType<typeof useProjetos>['projetos'][number] | null>(null)
  const [activeTab, setActiveTab] = useState('quadro')
  const navigate = useNavigate()
  const { projetos, salvar } = useProjetos()
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleVerPendentes() {
    setActiveTab('lista')
  }

  function handleImportarDados() {
    salvar({ cliente: 'Família Tonin', ambiente: 'Sala de estar planejada', projetista: 'Marina Alves', etapa: 'projeto', valor: 28900, software: 'Promob' })
    salvar({ cliente: 'Helena Moretti', ambiente: 'Banheiro suíte', projetista: 'Carlos Dias', etapa: 'projeto', valor: 15400, software: 'Gabster' })
    toast.success('2 projetos importados do arquivo.')
  }

  function handleAprovarPendente() {
    const pendente = projetos.find((p) => !p.aprovado)
    if (!pendente) {
      toast.info('Nenhum projeto aguardando aprovação.')
      return
    }
    setPendenteDetail(pendente)
  }

  function handleDuplicar() {
    if (projetos.length === 0) {
      toast.info('Nenhum projeto para duplicar.')
      return
    }
    setActiveTab('lista')
    toast.info('Escolha o projeto e use "Duplicar" no menu de ações da linha.')
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => { if (e.target.files?.length) handleImportarDados(); e.target.value = '' }}
      />
      <PageHeader
        breadcrumb="Comercial · Projetos"
        title="Gestão de Projetos"
        description="Ambientes, versões e acompanhamento por etapa."
        actions={
          <>
            <Button variant="outline" onClick={() => exportarCsv(projetos)}>
              <Download className="size-4" />
              Exportar relatório
            </Button>
            <Button onClick={() => setNovoOpen(true)}>
              <Plus className="size-4" />
              Novo projeto
              <ChevronDown className="size-4" />
            </Button>
          </>
        }
      />

      <FiltroClienteChip />
      <ProjetosKpis onVerPendentes={handleVerPendentes} />

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
                  if (label === 'Novo projeto') setNovoOpen(true)
                  else if (label === 'Duplicar projeto') handleDuplicar()
                  else if (label === 'Relatórios de projetos') navigate('/bi')
                  else if (label === 'Agendar tarefa') navigate('/medicao')
                  else if (label === 'Aprovar pendente') handleAprovarPendente()
                  else if (label === 'Importar dados') fileInputRef.current?.click()
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

      <div className="mt-6">
        <ProjetosFiltros />
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="quadro">
                <KanbanSquare className="size-4" />
                Quadro
              </TabsTrigger>
              <TabsTrigger value="lista">
                <List className="size-4" />
                Lista
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="quadro" className="mt-4">
            <ProjetosKanban />
          </TabsContent>
          <TabsContent value="lista" className="mt-4">
            <ProjetosTable />
          </TabsContent>
        </Tabs>
      </div>

      <ProjetoFormDialog open={novoOpen} onOpenChange={setNovoOpen} projeto={null} />
      <ProjetoDetailSheet projeto={pendenteDetail} onOpenChange={(o) => !o && setPendenteDetail(null)} />
    </div>
  )
}

export default function ProjetosPage() {
  return (
    <ProjetosProvider>
      <SyncFiltro />
      <ProjetosContent />
    </ProjetosProvider>
  )
}
