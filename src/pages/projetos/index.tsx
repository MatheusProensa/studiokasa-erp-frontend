import { useMemo } from 'react'
import { FolderKanban, KanbanSquare, List, CircleCheck, Clock } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

export default function ProjetosPage() {
  return (
    <ProjetosProvider>
      <div>
        <PageHeader
          breadcrumb="Comercial · Projetos"
          title="Gestão de Projetos"
          description="Ambientes, versões e acompanhamento por etapa."
        />

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
