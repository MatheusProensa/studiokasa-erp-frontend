import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FolderKanban, KanbanSquare, List, CircleCheck, Clock, X } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/patterns/stat-card'
import { ProjetosProvider, useProjetos } from '@/features/projetos/projetos-context'
import { ProjetosKanban } from '@/features/projetos/projetos-kanban'
import { ProjetosTable } from '@/features/projetos/projetos-table'

function ProjetosKpis() {
  const { projetos } = useProjetos()
  const stats = useMemo(() => {
    const ativos = projetos.filter((p) => p.etapa !== 'montagem').length
    const aguardando = projetos.filter((p) => !p.aprovado).length
    const emProducao = projetos.filter((p) => p.etapa === 'producao').length
    return { ativos, aguardando, emProducao }
  }, [projetos])

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Projetos ativos" value={String(stats.ativos)} icon={FolderKanban} />
      <StatCard label="Em produção" value={String(stats.emProducao)} icon={CircleCheck} />
      <StatCard label="Aguardando aprovação" value={String(stats.aguardando)} icon={Clock} />
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
        onClick={() => {
          setFiltroCliente(null)
          setParams({})
        }}
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
  useEffect(() => {
    setFiltroCliente(cliente)
  }, [cliente, setFiltroCliente])
  return null
}

export default function ProjetosPage() {
  return (
    <ProjetosProvider>
      <SyncFiltro />
      <div>
        <PageHeader
          breadcrumb="Comercial · Projetos"
          title="Gestão de Projetos"
          description="Ambientes, versões e acompanhamento por etapa."
        />

        <FiltroClienteChip />
        <ProjetosKpis />

        <Tabs defaultValue="quadro" className="mt-6">
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

          <TabsContent value="quadro" className="mt-6">
            <ProjetosKanban />
          </TabsContent>
          <TabsContent value="lista" className="mt-6">
            <ProjetosTable />
          </TabsContent>
        </Tabs>
      </div>
    </ProjetosProvider>
  )
}
