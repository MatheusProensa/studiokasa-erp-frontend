import { useMemo } from 'react'
import { Truck, ClipboardList, Users, PackageCheck, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { StatCard } from '@/components/patterns/stat-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogisticaProvider, useLogistica } from '@/features/logistica/logistica-context'
import { OrdensTab } from '@/features/logistica/ordens-tab'
import { EquipesTab } from '@/features/logistica/equipes-tab'

function LogisticaKpis() {
  const { ordens } = useLogistica()
  const stats = useMemo(() => {
    const ativas = ordens.filter((o) => o.status !== 'concluida').length
    const concluidas = ordens.filter((o) => o.status === 'concluida').length
    const avarias = ordens.reduce((s, o) => s + o.avarias.length, 0)
    return { ativas, concluidas, avarias }
  }, [ordens])

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="OS ativas" value={String(stats.ativas)} icon={Truck} />
      <StatCard label="Concluídas" value={String(stats.concluidas)} icon={PackageCheck} tone="success" />
      <StatCard label="Avarias registradas" value={String(stats.avarias)} icon={AlertTriangle} tone="danger" />
    </div>
  )
}

export default function LogisticaPage() {
  return (
    <LogisticaProvider>
      <div>
        <PageHeader
          breadcrumb="Operações · Logística e Montagem"
          title="Logística e Montagem"
          description="Agenda de entregas, ordens de montagem, avarias e equipes."
        />
        <LogisticaKpis />

        <Tabs defaultValue="ordens" className="mt-6">
          <TabsList>
            <TabsTrigger value="ordens">
              <ClipboardList className="size-4" />
              Ordens
            </TabsTrigger>
            <TabsTrigger value="equipes">
              <Users className="size-4" />
              Equipes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ordens" className="mt-6">
            <OrdensTab />
          </TabsContent>
          <TabsContent value="equipes" className="mt-6">
            <EquipesTab />
          </TabsContent>
        </Tabs>
      </div>
    </LogisticaProvider>
  )
}
